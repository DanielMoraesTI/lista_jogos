"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { games } from "@/db/schema";
import { findCoverUrl } from "@/lib/rawg";
import { getSessionUserId } from "@/lib/session";
import { gameIdSchema, gameSchema, type GameInput } from "@/lib/validations";

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof GameInput, string>> };

const UNAUTHORIZED: ActionResult = { ok: false, error: "Sua sessão expirou. Faça login novamente." };

function toFieldErrors(issues: { path: PropertyKey[]; message: string }[]) {
  const fieldErrors: Partial<Record<keyof GameInput, string>> = {};
  for (const issue of issues) {
    const key = issue.path[0] as keyof GameInput | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

/** Normaliza os dados validados para o formato do banco. */
function toRow(data: GameInput) {
  return {
    title: data.title,
    platform: data.platform,
    status: data.status,
    rating: data.rating === null ? null : Math.round(data.rating * 100) / 100,
    hoursPlayed: Math.round(data.hoursPlayed * 10) / 10,
    comment: data.comment || null,
    // Data de conclusão só é mantida para jogos concluídos.
    completedAt: data.status === "completed" ? data.completedAt : null,
  };
}

export async function createGameAction(input: GameInput): Promise<ActionResult> {
  const userId = await getSessionUserId();
  if (!userId) return UNAUTHORIZED;

  const parsed = gameSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Confira os campos destacados.", fieldErrors: toFieldErrors(parsed.error.issues) };
  }

  const row = toRow(parsed.data);
  const coverUrl = await findCoverUrl(row.title, row);

  try {
    await db.insert(games).values({ ...row, coverUrl, userId });
  } catch (error) {
    console.error("[createGame]", error);
    return { ok: false, error: "Não foi possível salvar o jogo. Tente novamente." };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: `“${row.title}” adicionado à coleção!` };
}

export async function updateGameAction(id: string, input: GameInput): Promise<ActionResult> {
  const userId = await getSessionUserId();
  if (!userId) return UNAUTHORIZED;

  const parsedId = gameIdSchema.safeParse(id);
  const parsed = gameSchema.safeParse(input);
  if (!parsedId.success) return { ok: false, error: "Jogo inválido." };
  if (!parsed.success) {
    return { ok: false, error: "Confira os campos destacados.", fieldErrors: toFieldErrors(parsed.error.issues) };
  }

  const ownsGame = and(eq(games.id, parsedId.data), eq(games.userId, userId));
  const [current] = await db
    .select({ title: games.title, platform: games.platform, coverUrl: games.coverUrl })
    .from(games)
    .where(ownsGame)
    .limit(1);
  if (!current) return { ok: false, error: "Jogo não encontrado." };

  const row = toRow(parsed.data);
  // Rebusca a capa só se nome/plataforma mudaram ou se ainda não havia capa.
  const identityChanged =
    current.title.trim().toLowerCase() !== row.title.toLowerCase() || current.platform !== row.platform;
  const coverUrl =
    identityChanged || !current.coverUrl ? await findCoverUrl(row.title, row) : current.coverUrl;

  try {
    // `updated_at` é atualizado automaticamente ($onUpdate no schema).
    await db.update(games).set({ ...row, coverUrl }).where(ownsGame);
  } catch (error) {
    console.error("[updateGame]", error);
    return { ok: false, error: "Não foi possível salvar as alterações." };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: `“${row.title}” atualizado!` };
}

export async function deleteGameAction(id: string): Promise<ActionResult> {
  const userId = await getSessionUserId();
  if (!userId) return UNAUTHORIZED;

  const parsedId = gameIdSchema.safeParse(id);
  if (!parsedId.success) return { ok: false, error: "Jogo inválido." };

  const deleted = await db
    .delete(games)
    .where(and(eq(games.id, parsedId.data), eq(games.userId, userId)))
    .returning({ title: games.title });

  if (deleted.length === 0) return { ok: false, error: "Jogo não encontrado." };

  revalidatePath("/", "layout");
  return { ok: true, message: `“${deleted[0]!.title}” removido.` };
}
