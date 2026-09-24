import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth.config";

/**
 * Checagem otimista de sessão (apenas lê o cookie JWT, sem acessar o banco).
 * A autorização real acontece nas páginas e Server Actions.
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // Ignora API, arquivos estáticos e imagens otimizadas.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|avatars/|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
