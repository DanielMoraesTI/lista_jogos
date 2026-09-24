import type { NextAuthConfig } from "next-auth";

/** Rotas acessíveis sem login. Todo o resto exige sessão. */
const PUBLIC_PATHS = ["/", "/sobre", "/privacidade", "/termos"];
const AUTH_PATHS = ["/login", "/cadastro"];

/**
 * Configuração leve (sem banco/bcrypt), compartilhada com o `proxy.ts`.
 * O proxy faz apenas a checagem otimista; páginas e Server Actions
 * validam a sessão novamente no servidor.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = Boolean(auth?.user);
      const { pathname } = nextUrl;

      if (AUTH_PATHS.includes(pathname)) {
        // Usuário logado não precisa ver login/cadastro.
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
        return true;
      }

      if (PUBLIC_PATHS.includes(pathname)) return true;

      // Retornar false redireciona para /login?callbackUrl=...
      return isLoggedIn;
    },
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
} satisfies NextAuthConfig;
