"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { AuthError } from "next-auth";

import { db } from "@/db";
import { users } from "@/db/schema";
import { signIn, signOut } from "@/lib/auth";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validations";

export type AuthActionResult = { error: string } | undefined;

/**
 * Mantém apenas o caminho interno (descarta host/protocolo), evitando open
 * redirect. Aceita tanto "/jogos" quanto "http://localhost:3000/jogos".
 */
function safeCallback(url: string | undefined | null) {
  if (!url) return "/";
  try {
    const parsed = new URL(url, "http://internal.invalid");
    const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    return path.startsWith("/") && !path.startsWith("//") ? path : "/";
  } catch {
    return "/";
  }
}

export async function loginAction(
  input: LoginInput,
  callbackUrl?: string,
): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { error: "Dados de login inválidos." };

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeCallback(callbackUrl),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "E-mail ou senha incorretos." };
    }
    // Sucesso: signIn lança NEXT_REDIRECT, que precisa ser repassado.
    throw error;
  }
}

export async function registerAction(
  input: RegisterInput,
): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const { name, nickname, email, password } = parsed.data;

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) {
    return { error: "Já existe uma conta com este e-mail." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    await db.insert(users).values({ name, nickname, email, passwordHash });
  } catch {
    // Corrida entre dois cadastros com o mesmo e-mail (unique constraint).
    return { error: "Não foi possível criar a conta. Tente novamente." };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Conta criada! Faça login para continuar." };
    }
    throw error;
  }
}

export async function oauthSignInAction(
  provider: "google" | "github",
  callbackUrl?: string,
) {
  await signIn(provider, { redirectTo: safeCallback(callbackUrl) });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
