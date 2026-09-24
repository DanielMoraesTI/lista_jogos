/**
 * Aplica as migrations da pasta ./drizzle no banco apontado por DATABASE_URL.
 * Uso: npm run db:migrate
 */
import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não definida em .env.local");
  }

  const { neon } = await import("@neondatabase/serverless");
  const { drizzle } = await import("drizzle-orm/neon-http");
  const { migrate } = await import("drizzle-orm/neon-http/migrator");

  const db = drizzle({ client: neon(url) });
  console.log("⏳ Aplicando migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✅ Migrations aplicadas com sucesso.");
}

main().catch((error) => {
  console.error("❌ Falha ao aplicar migrations:", error);
  process.exit(1);
});
