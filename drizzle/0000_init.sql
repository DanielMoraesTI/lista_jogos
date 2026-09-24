CREATE TYPE "public"."game_status" AS ENUM('completed', 'playing', 'backlog');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('PC', 'XBOX', 'XBOX_360', 'XBOX_ONE', 'XBOX_SERIES', 'PS2', 'PS3', 'PS4', 'PS5', 'N64', 'WII', 'WII_U', 'SWITCH', 'SWITCH_2');--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(200) NOT NULL,
	"platform" "platform" NOT NULL,
	"status" "game_status" DEFAULT 'backlog' NOT NULL,
	"rating" numeric(4, 2),
	"hours_played" numeric(7, 1) DEFAULT 0 NOT NULL,
	"comment" varchar(140),
	"completed_at" date,
	"cover_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "games_rating_range" CHECK ("games"."rating" IS NULL OR ("games"."rating" >= 0 AND "games"."rating" <= 10)),
	CONSTRAINT "games_hours_non_negative" CHECK ("games"."hours_played" >= 0),
	CONSTRAINT "games_completed_requires_date" CHECK ("games"."status" <> 'completed' OR "games"."completed_at" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone,
	"password_hash" text,
	"nickname" varchar(32),
	"name" varchar(100),
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "games" ADD CONSTRAINT "games_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "games_user_platform_idx" ON "games" USING btree ("user_id","platform");--> statement-breakpoint
CREATE INDEX "games_user_status_idx" ON "games" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "games_user_created_idx" ON "games" USING btree ("user_id","created_at" DESC NULLS LAST);