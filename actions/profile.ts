"use server";

import { del, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { users } from "@/db/schema";
import { processAvatar } from "@/lib/avatar-image";
import {
  AVATAR_MAX_BYTES,
  AVATAR_TYPES,
  PRESET_AVATARS,
  presetAvatarUrl,
} from "@/lib/avatars";
import { getCurrentUser } from "@/lib/session";
import { profileSchema, type ProfileInput } from "@/lib/validations";

type Result = { ok: true; message: string } | { ok: false; error: string };

const UNAUTHORIZED: Result = { ok: false, error: "Sua sessão expirou. Faça login novamente." };

function isBlobUrl(url: string | null): url is string {
  return Boolean(url && /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i.test(url));
}

/** Remove o avatar antigo do Blob (se for um upload), sem falhar a operação. */
async function cleanupOldAvatar(previous: string | null) {
  if (isBlobUrl(previous) && process.env.BLOB_READ_WRITE_TOKEN) {
    await del(previous).catch(() => undefined);
  }
}

export async function updateProfileAction(input: ProfileInput): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return UNAUTHORIZED;

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  await db.update(users).set(parsed.data).where(eq(users.id, user.id));
  revalidatePath("/", "layout");
  return { ok: true, message: "Perfil atualizado!" };
}

export async function setPresetAvatarAction(id: string): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return UNAUTHORIZED;

  const preset = PRESET_AVATARS.find((a) => a.id === id);
  if (!preset) return { ok: false, error: "Avatar inválido." };

  await db.update(users).set({ image: presetAvatarUrl(preset.id) }).where(eq(users.id, user.id));
  await cleanupOldAvatar(user.image);
  revalidatePath("/", "layout");
  return { ok: true, message: `Avatar “${preset.label}” equipado!` };
}

/** Confere a assinatura binária do arquivo (não confia só no Content-Type). */
function detectImageType(bytes: Uint8Array): (typeof AVATAR_TYPES)[number] | null {
  const hex = Array.from(bytes.slice(0, 12), (b) => b.toString(16).padStart(2, "0")).join("");
  if (hex.startsWith("89504e470d0a1a0a")) return "image/png";
  if (hex.startsWith("ffd8ff")) return "image/jpeg";
  if (hex.startsWith("47494638")) return "image/gif";
  if (hex.startsWith("52494646") && hex.slice(16, 24) === "57454250") return "image/webp";
  return null;
}

export async function uploadAvatarAction(formData: FormData): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return UNAUTHORIZED;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: "Upload de imagens não está configurado neste servidor." };
  }

  const file = formData.get("avatar");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Selecione uma imagem." };
  }
  if (file.size > AVATAR_MAX_BYTES) {
    return { ok: false, error: "A imagem deve ter no máximo 2 MB." };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) {
    return { ok: false, error: "Formato não suportado. Use PNG, JPG, WEBP ou GIF." };
  }

  // Remove metadados (ex.: GPS), padroniza em 512×512 WebP e valida que é imagem real.
  const processed = await processAvatar(bytes);
  if (!processed) {
    return { ok: false, error: "Não foi possível ler a imagem. Tente outro arquivo." };
  }

  // Nome aleatório: não expõe o id do usuário e não pode ser adivinhado.
  const blob = await put(`avatars/${randomUUID()}.webp`, processed, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: true,
  });

  await db.update(users).set({ image: blob.url }).where(eq(users.id, user.id));
  await cleanupOldAvatar(user.image);
  revalidatePath("/", "layout");
  return { ok: true, message: "Avatar atualizado!" };
}
