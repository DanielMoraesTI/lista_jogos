import { sql } from "drizzle-orm";
import {
  check,
  date,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

import { GAME_STATUSES, PLATFORMS } from "@/lib/platforms";

export const platformEnum = pgEnum("platform", PLATFORMS);
export const gameStatusEnum = pgEnum("game_status", GAME_STATUSES);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

/**
 * Usuários. As colunas `name`, `email`, `emailVerified` e `image` seguem o
 * formato exigido pelo adapter do Auth.js; `image` é gravada em `avatar_url`.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", {
    withTimezone: true,
    mode: "date",
  }),
  /** Nulo para contas criadas apenas via OAuth. */
  passwordHash: text("password_hash"),
  nickname: varchar("nickname", { length: 32 }),
  name: varchar("name", { length: 100 }),
  image: text("avatar_url"),
  ...timestamps,
});

/** Contas OAuth vinculadas (Google/GitHub), usadas pelo adapter do Auth.js. */
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("accounts_user_id_idx").on(t.userId),
  ],
);

export const games = pgTable(
  "games",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 200 }).notNull(),
    platform: platformEnum("platform").notNull(),
    status: gameStatusEnum("status").notNull().default("backlog"),
    rating: numeric("rating", { precision: 4, scale: 2, mode: "number" }),
    hoursPlayed: numeric("hours_played", {
      precision: 7,
      scale: 1,
      mode: "number",
    })
      .notNull()
      .default(0),
    comment: varchar("comment", { length: 140 }),
    /** Data no formato ISO `YYYY-MM-DD`. */
    completedAt: date("completed_at", { mode: "string" }),
    coverUrl: text("cover_url"),
    ...timestamps,
  },
  (t) => [
    // Toda consulta filtra por usuário primeiro, por isso índices compostos.
    index("games_user_platform_idx").on(t.userId, t.platform),
    index("games_user_status_idx").on(t.userId, t.status),
    index("games_user_created_idx").on(t.userId, t.createdAt.desc()),
    check(
      "games_rating_range",
      sql`${t.rating} IS NULL OR (${t.rating} >= 0 AND ${t.rating} <= 10)`,
    ),
    check("games_hours_non_negative", sql`${t.hoursPlayed} >= 0`),
    check(
      "games_completed_requires_date",
      sql`${t.status} <> 'completed' OR ${t.completedAt} IS NOT NULL`,
    ),
  ],
);

export type User = typeof users.$inferSelect;
export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
