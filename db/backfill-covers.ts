/**
 * Busca na RAWG a capa dos jogos que ainda não têm `cover_url`.
 * Uso: npm run db:covers            (só os sem capa)
 *      npm run db:covers -- --all   (refaz a busca para todos)
 * Lê DATABASE_URL e RAWG_API_KEY do .env.local.
 */
import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

async function main() {
  const url = process.env.DATABASE_URL;
  const key = process.env.RAWG_API_KEY;
  if (!url) throw new Error("DATABASE_URL não definida em .env.local");
  if (!key) throw new Error("RAWG_API_KEY não definida em .env.local");
  const all = process.argv.includes("--all");

  const [{ neon }, { drizzle }, { eq, isNull }, schema, { fetchRawgCover }] = await Promise.all([
    import("@neondatabase/serverless"),
    import("drizzle-orm/neon-http"),
    import("drizzle-orm"),
    import("./schema"),
    import("../lib/rawg-core"),
  ]);
  const db = drizzle({ client: neon(url), schema });
  const { games } = schema;

  const rows = await db
    .select({
      id: games.id,
      title: games.title,
      platform: games.platform,
      completedAt: games.completedAt,
      updatedAt: games.updatedAt,
    })
    .from(games)
    .where(all ? undefined : isNull(games.coverUrl));

  console.log(`🔎 ${rows.length} jogo(s) para buscar capa...`);
  let found = 0;
  for (const row of rows) {
    // Script offline: pode esperar mais e tentar de novo.
    const cover = await fetchRawgCover(row.title, key, row, { timeoutMs: 10_000, retries: 2 });
    if (cover) {
      // Mantém updated_at: buscar capa não é uma "edição" feita pelo usuário.
      await db.update(games).set({ coverUrl: cover.url, updatedAt: row.updatedAt }).where(eq(games.id, row.id));
      found++;
      console.log(`  ✅ ${row.title} [${row.platform}] → ${cover.matchedName} (${cover.released?.slice(0, 4) ?? "?"})`);
    } else {
      console.log(`  ➖ ${row.title} (não encontrada)`);
    }
    await new Promise((r) => setTimeout(r, 250)); // gentil com o limite da API
  }
  console.log(`\n🎨 ${found}/${rows.length} capas atualizadas.`);
}

main().catch((error) => {
  console.error("❌ Falhou:", error instanceof Error ? error.message : error);
  process.exit(1);
});
