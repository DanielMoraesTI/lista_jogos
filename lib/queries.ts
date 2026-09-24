import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  sql,
  type SQL,
} from "drizzle-orm";

import { db } from "@/db";
import { games, type Game } from "@/db/schema";
import { PAGE_SIZE, type GameFilters } from "@/lib/filters";
import {
  FAMILIES,
  PLATFORMS,
  platformFamily,
  platformsOfFamily,
  type Family,
  type Platform,
} from "@/lib/platforms";

export type GameScope = {
  family?: Family | null;
  filters?: Partial<Pick<GameFilters, "q" | "status" | "platform">>;
};

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

/** Monta o WHERE sempre restrito ao usuário dono dos dados. */
export function buildWhere(userId: string, scope: GameScope = {}): SQL {
  const conditions: SQL[] = [eq(games.userId, userId)];
  const { family, filters = {} } = scope;

  if (filters.platform) {
    conditions.push(eq(games.platform, filters.platform));
  } else if (family) {
    conditions.push(inArray(games.platform, platformsOfFamily(family)));
  }
  if (filters.status) conditions.push(eq(games.status, filters.status));
  if (filters.q) conditions.push(ilike(games.title, `%${escapeLike(filters.q)}%`));

  return and(...conditions)!;
}

export function buildOrderBy(sort: GameFilters["sort"], dir: GameFilters["dir"]): SQL[] {
  const direction = dir === "asc" ? asc : desc;
  const nulls = sql.raw(dir === "asc" ? "NULLS FIRST" : "NULLS LAST");
  switch (sort) {
    case "title":
      return [direction(sql`lower(${games.title})`), desc(games.createdAt)];
    case "rating":
      return [sql`${games.rating} ${sql.raw(dir)} ${nulls}`, asc(games.title)];
    case "hours":
      return [direction(games.hoursPlayed), asc(games.title)];
    case "completed":
      return [sql`${games.completedAt} ${sql.raw(dir)} ${nulls}`, asc(games.title)];
    case "updated":
      return [direction(games.updatedAt)];
    default:
      return [direction(games.createdAt)];
  }
}

export async function getGamesPage(
  userId: string,
  filters: GameFilters,
  family?: Family | null,
): Promise<{ items: Game[]; total: number; page: number; pageCount: number }> {
  const where = buildWhere(userId, { family, filters });

  const [{ total }] = await db.select({ total: count() }).from(games).where(where);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(filters.page, pageCount);

  const items = await db
    .select()
    .from(games)
    .where(where)
    .orderBy(...buildOrderBy(filters.sort, filters.dir))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  return { items, total, page, pageCount };
}

/** Todos os jogos de um escopo (usado na exportação). */
export async function getGamesForExport(
  userId: string,
  scope: GameScope,
  sort: GameFilters["sort"] = "title",
  dir: GameFilters["dir"] = "asc",
): Promise<Game[]> {
  return db
    .select()
    .from(games)
    .where(buildWhere(userId, scope))
    .orderBy(...buildOrderBy(sort, dir))
    .limit(10_000);
}

/** Quantidade de jogos por plataforma, para os chips de subcategoria. */
export async function getPlatformCounts(
  userId: string,
  family?: Family | null,
): Promise<Partial<Record<Platform, number>>> {
  const rows = await db
    .select({ platform: games.platform, total: count() })
    .from(games)
    .where(buildWhere(userId, { family }))
    .groupBy(games.platform);
  return Object.fromEntries(rows.map((r) => [r.platform, r.total]));
}

// ---------------------------------------------------------------------------
// Dashboard / perfil
// ---------------------------------------------------------------------------

export type DashboardData = {
  totals: {
    games: number;
    completed: number;
    playing: number;
    backlog: number;
    hours: number;
    avgRating: number | null;
  };
  byPlatform: { platform: Platform; total: number }[];
  byFamily: { family: Family; total: number; hours: number }[];
  mostPlayed: Game | null;
  topRated: Game | null;
  recent: Game[];
};

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const mine = eq(games.userId, userId);

  const [totalsRows, platformRows, mostPlayedRows, topRatedRows, recent] = await Promise.all([
    db
      .select({
        games: count(),
        completed: sql<number>`count(*) filter (where ${games.status} = 'completed')`.mapWith(Number),
        playing: sql<number>`count(*) filter (where ${games.status} = 'playing')`.mapWith(Number),
        backlog: sql<number>`count(*) filter (where ${games.status} = 'backlog')`.mapWith(Number),
        hours: sql<number>`coalesce(sum(${games.hoursPlayed}), 0)`.mapWith(Number),
        avgRating: sql<number | null>`avg(${games.rating})`.mapWith((v) =>
          v === null ? null : Number(v),
        ),
      })
      .from(games)
      .where(mine),
    db
      .select({
        platform: games.platform,
        total: count(),
        hours: sql<number>`coalesce(sum(${games.hoursPlayed}), 0)`.mapWith(Number),
      })
      .from(games)
      .where(mine)
      .groupBy(games.platform),
    db
      .select()
      .from(games)
      .where(and(mine, sql`${games.hoursPlayed} > 0`))
      .orderBy(desc(games.hoursPlayed), desc(games.rating))
      .limit(1),
    db
      .select()
      .from(games)
      .where(and(mine, sql`${games.rating} IS NOT NULL`))
      .orderBy(desc(games.rating), desc(games.hoursPlayed))
      .limit(1),
    db.select().from(games).where(mine).orderBy(desc(games.createdAt)).limit(10),
  ]);

  const byPlatform = PLATFORMS.map((platform) => ({
    platform,
    total: platformRows.find((r) => r.platform === platform)?.total ?? 0,
  })).filter((r) => r.total > 0);

  const byFamily = FAMILIES.map((family) => {
    const rows = platformRows.filter((r) => platformFamily(r.platform) === family);
    return {
      family,
      total: rows.reduce((acc, r) => acc + r.total, 0),
      hours: rows.reduce((acc, r) => acc + r.hours, 0),
    };
  });

  const t = totalsRows[0];
  return {
    totals: {
      games: t?.games ?? 0,
      completed: t?.completed ?? 0,
      playing: t?.playing ?? 0,
      backlog: t?.backlog ?? 0,
      hours: t?.hours ?? 0,
      avgRating: t?.avgRating ?? null,
    },
    byPlatform,
    byFamily,
    mostPlayed: mostPlayedRows[0] ?? null,
    topRated: topRatedRows[0] ?? null,
    recent,
  };
}

export type ProfileStats = {
  total: number;
  hours: number;
  completed: number;
  favoritePlatform: Platform | null;
};

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const rows = await db
    .select({
      platform: games.platform,
      total: count(),
      completed: sql<number>`count(*) filter (where ${games.status} = 'completed')`.mapWith(Number),
      hours: sql<number>`coalesce(sum(${games.hoursPlayed}), 0)`.mapWith(Number),
    })
    .from(games)
    .where(eq(games.userId, userId))
    .groupBy(games.platform);

  // Plataforma favorita: mais horas; empate decidido pelo número de jogos.
  const favorite = [...rows].sort((a, b) => b.hours - a.hours || b.total - a.total)[0];

  return {
    total: rows.reduce((acc, r) => acc + r.total, 0),
    hours: rows.reduce((acc, r) => acc + r.hours, 0),
    completed: rows.reduce((acc, r) => acc + r.completed, 0),
    favoritePlatform: favorite?.platform ?? null,
  };
}
