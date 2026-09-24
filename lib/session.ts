import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";

export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
  nickname: string | null;
  image: string | null;
  createdAt: Date;
  hasPassword: boolean;
};

/**
 * Usuário logado, lido do banco (fonte de verdade para nickname/avatar).
 * `cache` deduplica a consulta dentro de uma mesma requisição.
 * Retorna null se não houver sessão ou se o usuário foi removido.
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      nickname: users.nickname,
      image: users.image,
      createdAt: users.createdAt,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return { ...rest, hasPassword: Boolean(passwordHash) };
});

/** Para páginas protegidas: garante usuário ou redireciona ao login. */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Para Server Actions / Route Handlers: retorna só o id ou null. */
export async function getSessionUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id ?? null;
}

export function displayName(user: Pick<CurrentUser, "nickname" | "name" | "email">) {
  return user.nickname || user.name || user.email.split("@")[0];
}
