import "server-only";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { db } from "@/db";
import { accounts, users } from "@/db/schema";
import { authConfig } from "@/lib/auth.config";
import { loginSchema } from "@/lib/validations";

/**
 * Hash bcrypt de uma string aleatória descartada. Quando o e-mail não existe,
 * comparamos a senha com ele mesmo assim, para que o tempo de resposta não
 * revele quais e-mails estão cadastrados.
 */
const DUMMY_HASH =
  "$2b$12$Q/Ltqn.5LU7fIBfHJmmi7eCUWEFcp4Mtif0QzMudNUFZbz/CCHx6m";

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: "E-mail", type: "email" },
      password: { label: "Senha", type: "password" },
    },
    async authorize(raw) {
      const parsed = loginSchema.safeParse(raw);
      if (!parsed.success) return null;

      const { email, password } = parsed.data;
      const [user] = await db
        .select({
          id: users.id,
          email: users.email,
          name: users.name,
          image: users.image,
          passwordHash: users.passwordHash,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      const valid = await bcrypt.compare(
        password,
        user?.passwordHash ?? DUMMY_HASH,
      );
      if (!user?.passwordHash || !valid) return null;

      return { id: user.id, email: user.email, name: user.name, image: user.image };
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  // O Google só entrega e-mails verificados, então é seguro vincular
  // automaticamente a uma conta já criada com e-mail/senha.
  providers.push(Google({ allowDangerousEmailAccountLinking: true }));
}
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(GitHub);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db, { usersTable: users, accountsTable: accounts }),
  providers,
  events: {
    /** Contas criadas via OAuth recebem um nickname inicial editável. */
    async createUser({ user }) {
      if (!user.id) return;
      const base = (user.name || user.email?.split("@")[0] || "player")
        .normalize("NFD")
        .replace(/[^\w.-]/g, "")
        .slice(0, 24);
      const nickname = `${base || "player"}${Math.floor(Math.random() * 900 + 100)}`;
      await db
        .update(users)
        .set({ nickname })
        .where(eq(users.id, user.id));
    },
  },
});

/** Provedores OAuth habilitados (para exibir os botões na tela de login). */
export const oauthProviders = {
  google: Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET),
  github: Boolean(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET),
};
