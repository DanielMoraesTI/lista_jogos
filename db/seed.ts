/**
 * Popula o banco com um usuário de demonstração e uma coleção de exemplo.
 * Uso: npm run db:seed   (lê SEED_EMAIL e SEED_PASSWORD do .env.local)
 *
 * É idempotente: se o usuário já existir, os jogos dele são recriados.
 * Não use em produção.
 */
import { config } from "dotenv";

config({ path: [".env.local", ".env"], quiet: true });

import type { GameStatus, Platform } from "../lib/platforms";

type SeedGame = {
  title: string;
  platform: Platform;
  status: GameStatus;
  rating?: number;
  hoursPlayed: number;
  comment?: string;
  completedAt?: string;
  daysAgo: number;
};

const GAMES: SeedGame[] = [
  { title: "The Legend of Zelda: Tears of the Kingdom", platform: "SWITCH", status: "completed", rating: 9.85, hoursPlayed: 142, comment: "Construir engenhocas nunca foi tão viciante.", completedAt: "2024-02-18", daysAgo: 40 },
  { title: "Elden Ring", platform: "PC", status: "completed", rating: 9.7, hoursPlayed: 168.5, comment: "Malenia me ensinou humildade.", completedAt: "2023-08-10", daysAgo: 38 },
  { title: "God of War Ragnarök", platform: "PS5", status: "completed", rating: 9.4, hoursPlayed: 52, comment: "BOY! Narrativa impecável.", completedAt: "2023-03-02", daysAgo: 36 },
  { title: "Halo Infinite", platform: "XBOX_SERIES", status: "completed", rating: 8.1, hoursPlayed: 24, comment: "O gancho salvou a campanha.", completedAt: "2022-01-15", daysAgo: 35 },
  { title: "Baldur's Gate 3", platform: "PC", status: "playing", rating: 9.5, hoursPlayed: 88, comment: "Ato 3 e ainda não sei o que estou fazendo.", daysAgo: 30 },
  { title: "Super Mario 64", platform: "N64", status: "completed", rating: 9.2, hoursPlayed: 30, comment: "Onde tudo começou em 3D.", completedAt: "1998-12-25", daysAgo: 29 },
  { title: "The Last of Us Part II", platform: "PS4", status: "completed", rating: 9.0, hoursPlayed: 28, comment: "Pesado, mas inesquecível.", completedAt: "2020-07-05", daysAgo: 27 },
  { title: "Forza Horizon 5", platform: "XBOX_SERIES", status: "playing", rating: 8.6, hoursPlayed: 61.5, comment: "México lindo a 300 km/h.", daysAgo: 25 },
  { title: "Gears of War 3", platform: "XBOX_360", status: "completed", rating: 8.8, hoursPlayed: 14, comment: "Coop de sofá raiz.", completedAt: "2011-10-02", daysAgo: 24 },
  { title: "Shadow of the Colossus", platform: "PS2", status: "completed", rating: 9.3, hoursPlayed: 12, comment: "Arte pura.", completedAt: "2007-05-20", daysAgo: 22 },
  { title: "Hollow Knight: Silksong", platform: "SWITCH_2", status: "backlog", hoursPlayed: 0, comment: "Finalmente saiu!", daysAgo: 20 },
  { title: "Red Dead Redemption 2", platform: "XBOX_ONE", status: "completed", rating: 9.6, hoursPlayed: 95, comment: "Arthur Morgan merecia mais.", completedAt: "2019-04-11", daysAgo: 18 },
  { title: "Mario Kart Wii", platform: "WII", status: "completed", rating: 8.4, hoursPlayed: 70, comment: "Casco azul destruiu amizades.", completedAt: "2009-01-10", daysAgo: 16 },
  { title: "Uncharted 2: Among Thieves", platform: "PS3", status: "completed", rating: 9.1, hoursPlayed: 11, comment: "A cena do trem!", completedAt: "2010-03-14", daysAgo: 14 },
  { title: "Hades II", platform: "PC", status: "playing", rating: 9.0, hoursPlayed: 34, comment: "Só mais uma run...", daysAgo: 12 },
  { title: "Splatoon 3", platform: "SWITCH", status: "playing", hoursPlayed: 19, daysAgo: 10 },
  { title: "Mario Kart 8 Deluxe", platform: "WII_U", status: "completed", rating: 8.7, hoursPlayed: 45, completedAt: "2015-06-01", daysAgo: 9 },
  { title: "Fable", platform: "XBOX", status: "completed", rating: 8.0, hoursPlayed: 20, comment: "Chutei galinhas demais.", completedAt: "2005-09-09", daysAgo: 8 },
  { title: "Death Stranding 2", platform: "PS5", status: "backlog", hoursPlayed: 0, comment: "Kojima, eu confio.", daysAgo: 6 },
  { title: "Hollow Knight", platform: "PC", status: "completed", rating: 9.4, hoursPlayed: 47, comment: "Metroidvania perfeito.", completedAt: "2021-11-20", daysAgo: 5 },
  { title: "Metroid Prime 4: Beyond", platform: "SWITCH_2", status: "backlog", hoursPlayed: 0, daysAgo: 4 },
  { title: "Starfield", platform: "XBOX_SERIES", status: "backlog", hoursPlayed: 3, comment: "Um dia eu volto.", daysAgo: 3 },
  { title: "Astro Bot", platform: "PS5", status: "completed", rating: 9.25, hoursPlayed: 16, comment: "Pura alegria em forma de jogo.", completedAt: "2024-10-01", daysAgo: 2 },
  { title: "Cyberpunk 2077", platform: "PC", status: "backlog", hoursPlayed: 5.5, comment: "Esperando o PC novo.", daysAgo: 1 },
];

async function main() {
  const url = process.env.DATABASE_URL;
  const email = process.env.SEED_EMAIL?.toLowerCase();
  const password = process.env.SEED_PASSWORD;
  if (!url) throw new Error("DATABASE_URL não definida em .env.local");
  if (!email || !password || password.length < 8) {
    throw new Error("Defina SEED_EMAIL e SEED_PASSWORD (mín. 8 caracteres) em .env.local");
  }

  const [{ neon }, { drizzle }, { eq }, bcrypt, schema] = await Promise.all([
    import("@neondatabase/serverless"),
    import("drizzle-orm/neon-http"),
    import("drizzle-orm"),
    import("bcryptjs"),
    import("./schema"),
  ]);
  const db = drizzle({ client: neon(url), schema });
  const { users, games } = schema;

  let [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (!user) {
    [user] = await db
      .insert(users)
      .values({
        email,
        name: "Player Demo",
        nickname: "demo_player",
        image: "/avatars/knight.svg",
        passwordHash: await bcrypt.default.hash(password, 12),
      })
      .returning({ id: users.id });
    console.log(`👤 Usuário criado: ${email}`);
  } else {
    console.log(`👤 Usuário já existia: ${email} — recriando jogos`);
  }
  if (!user) throw new Error("Falha ao criar usuário");

  await db.delete(games).where(eq(games.userId, user.id));

  const now = Date.now();
  await db.insert(games).values(
    GAMES.map((g) => {
      const createdAt = new Date(now - g.daysAgo * 86_400_000);
      return {
        userId: user.id,
        title: g.title,
        platform: g.platform,
        status: g.status,
        rating: g.rating ?? null,
        hoursPlayed: g.hoursPlayed,
        comment: g.comment ?? null,
        completedAt: g.completedAt ?? null,
        createdAt,
        updatedAt: createdAt,
      };
    }),
  );

  console.log(`🎮 ${GAMES.length} jogos inseridos. Login: ${email}`);
}

main().catch((error) => {
  console.error("❌ Seed falhou:", error);
  process.exit(1);
});
