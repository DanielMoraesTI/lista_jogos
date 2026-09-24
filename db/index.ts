import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && process.env.NODE_ENV === "production") {
  console.error(
    "[db] DATABASE_URL não definida. Configure-a nas variáveis de ambiente.",
  );
}

/**
 * Cliente HTTP do Neon: ideal para funções serverless na Vercel
 * (sem conexões TCP persistentes para gerenciar).
 * A URL placeholder permite que o build rode sem banco; qualquer query
 * falhará com erro claro se a variável não estiver configurada.
 */
export const db = drizzle({
  client: neon(databaseUrl || "postgresql://missing:missing@localhost/missing"),
  schema,
});

export { schema };
