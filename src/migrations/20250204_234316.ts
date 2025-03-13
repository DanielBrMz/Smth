import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // First, create enum types
  await db.execute(sql`
  DO $$
  BEGIN
    -- Create enum types if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_users_role') THEN
      CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'reviewer');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_insights_insight_location') THEN
      CREATE TYPE "public"."enum_insights_insight_location" AS ENUM('Welcome Video', 'Account Onboarding Account Onboarding Start', 'Account Onboarding Address', 'Account Onboarding Annual Income', 'Account Onboarding Brokerage Accounts', 'Account Onboarding Choose Account Type', 'Account Onboarding Citizenship Status', 'Account Onboarding Disclosures', 'Account Onboarding Employment Status', 'Account Onboarding Investment Experience', 'Account Onboarding Investment Goal', 'Account Onboarding Liquid Net Worth', 'Account Onboarding Retirement Accounts', 'Account Onboarding Risk Tolerance', 'Account Onboarding Tax Filing Status', 'Account Onboarding Time Horizon', 'Account Onboarding Total Net Worth', 'Account Onboarding Trusted Contact', 'Account Onboarding Verify Identity', 'Explore Growth Sidepockets', 'Explore Income Sidepockets', 'Explore Model Sidepocket', 'Explore Preservation Sidepockets', 'Explore Speculative Sidepockets', 'Explore Which Sidepocket is right for me?', 'Funding Funding Schedule', 'Funding One-time Transaction', 'Menu Account Value', 'Menu Available for Withdrawal', 'Menu Buying Power', 'Menu Explore', 'Menu Funding', 'Menu My Sidepockets', 'Menu Sidepocket Premier', 'Menu Sidepocket Value', 'My Sidepocket Add Account', 'My Sidepocket Dow Jones ETF', 'My Sidepocket Live Sidepocket List', 'My Sidepocket Live User Sidepocket', 'My Sidepocket S&P 500 ETF', 'My Sidepocket Transactions', 'My Sidepocket QQQ ETF', 'Onboarding 30 Day Access Screen', 'Onboarding Sign Up Screen', 'Onboarding Splash Screen', 'Subscription Selection All Access Subscription', 'Subscription Selection Lite Subscription');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_insights_review_status') THEN
      CREATE TYPE "public"."enum_insights_review_status" AS ENUM('todo', 'sent_to_review', 'in_progress', 'rejected', 'approved', 'changes_requested');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_insights_state') THEN
      CREATE TYPE "public"."enum_insights_state" AS ENUM('Draft', 'Ready for Review', 'Approved', 'Rejected', 'Published');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_insights_status') THEN
      CREATE TYPE "public"."enum_insights_status" AS ENUM('draft', 'published');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__insights_v_version_insight_location') THEN
      CREATE TYPE "public"."enum__insights_v_version_insight_location" AS ENUM('Welcome Video', 'Account Onboarding Account Onboarding Start', 'Account Onboarding Address', 'Account Onboarding Annual Income', 'Account Onboarding Brokerage Accounts', 'Account Onboarding Choose Account Type', 'Account Onboarding Citizenship Status', 'Account Onboarding Disclosures', 'Account Onboarding Employment Status', 'Account Onboarding Investment Experience', 'Account Onboarding Investment Goal', 'Account Onboarding Liquid Net Worth', 'Account Onboarding Retirement Accounts', 'Account Onboarding Risk Tolerance', 'Account Onboarding Tax Filing Status', 'Account Onboarding Time Horizon', 'Account Onboarding Total Net Worth', 'Account Onboarding Trusted Contact', 'Account Onboarding Verify Identity', 'Explore Growth Sidepockets', 'Explore Income Sidepockets', 'Explore Model Sidepocket', 'Explore Preservation Sidepockets', 'Explore Speculative Sidepockets', 'Explore Which Sidepocket is right for me?', 'Funding Funding Schedule', 'Funding One-time Transaction', 'Menu Account Value', 'Menu Available for Withdrawal', 'Menu Buying Power', 'Menu Explore', 'Menu Funding', 'Menu My Sidepockets', 'Menu Sidepocket Premier', 'Menu Sidepocket Value', 'My Sidepocket Add Account', 'My Sidepocket Dow Jones ETF', 'My Sidepocket Live Sidepocket List', 'My Sidepocket Live User Sidepocket', 'My Sidepocket S&P 500 ETF', 'My Sidepocket Transactions', 'My Sidepocket QQQ ETF', 'Onboarding 30 Day Access Screen', 'Onboarding Sign Up Screen', 'Onboarding Splash Screen', 'Subscription Selection All Access Subscription', 'Subscription Selection Lite Subscription');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__insights_v_version_review_status') THEN
      CREATE TYPE "public"."enum__insights_v_version_review_status" AS ENUM('todo', 'sent_to_review', 'in_progress', 'rejected', 'approved', 'changes_requested');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__insights_v_version_state') THEN
      CREATE TYPE "public"."enum__insights_v_version_state" AS ENUM('Draft', 'Ready for Review', 'Approved', 'Rejected', 'Published');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum__insights_v_version_status') THEN
      CREATE TYPE "public"."enum__insights_v_version_status" AS ENUM('draft', 'published');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_audience_employment_status') THEN
      CREATE TYPE "public"."enum_audience_employment_status" AS ENUM('EMPLOYED', 'SELF_EMPLOYED', 'RETIRED', 'STUDENT', 'OTHER');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_audience_income_range') THEN
      CREATE TYPE "public"."enum_audience_income_range" AS ENUM('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_audience_investment_experience') THEN
      CREATE TYPE "public"."enum_audience_investment_experience" AS ENUM('NONE', 'LIMITED', 'GOOD', 'EXTENSIVE');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_audience_net_worth') THEN
      CREATE TYPE "public"."enum_audience_net_worth" AS ENUM('ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_audience_status') THEN
      CREATE TYPE "public"."enum_audience_status" AS ENUM('ACTIVE', 'INACTIVE');
    END IF;
  END
  $$;
  `)

  // Now create tables in the correct order (base tables first, then tables with foreign keys)
  await db.execute(sql`
  -- First create all base tables without foreign key constraints
  CREATE TABLE IF NOT EXISTS "users" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "last_name" varchar,
    "username" varchar,
    "phone_number" varchar NOT NULL,
    "profile_picture_id" integer,
    "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "created_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "email" varchar NOT NULL,
    "reset_password_token" varchar,
    "reset_password_expiration" timestamp(3) with time zone,
    "salt" varchar,
    "hash" varchar,
    "login_attempts" numeric DEFAULT 0,
    "lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
    "id" serial PRIMARY KEY NOT NULL
    -- Add other columns for media table
  );
  
  CREATE TABLE IF NOT EXISTS "endorsers" (
    "id" serial PRIMARY KEY NOT NULL
    -- Add other columns for endorsers table
  );
  
  CREATE TABLE IF NOT EXISTS "insights" (
    "id" serial PRIMARY KEY NOT NULL
    -- Add other columns for insights table
  );
  
  CREATE TABLE IF NOT EXISTS "audience" (
    "id" serial PRIMARY KEY NOT NULL
    -- Add other columns for audience table
  );
  
  CREATE TABLE IF NOT EXISTS "contents" (
    "id" serial PRIMARY KEY NOT NULL
    -- Add other columns for contents table
  );
  
  CREATE TABLE IF NOT EXISTS "api_keys" (
    "id" serial PRIMARY KEY NOT NULL
    -- Add other columns for api_keys table
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
    "id" serial PRIMARY KEY NOT NULL,
    "collection" varchar,
    "document_id" varchar,
    "lock_id" varchar,
    "lock_exp" timestamp(3) with time zone,
    "user" jsonb,
    "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
    "id" serial PRIMARY KEY NOT NULL,
    "key" varchar,
    "value" jsonb,
    "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "batch" numeric,
    "updated_at" timestamp(3) with time zone NOT NULL DEFAULT now(),
    "created_at" timestamp(3) with time zone NOT NULL DEFAULT now()
  );
  
  -- Now create tables with foreign keys
  CREATE TABLE IF NOT EXISTS "users_role" (
    "order" integer NOT NULL,
    "parent_id" integer NOT NULL,
    "value" enum_users_role,
    "id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "endorsers_audience_stats_stats_employment" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "type" varchar,
    "count" numeric,
    "pct" numeric
  );
  
  -- Create other tables with foreign keys
  
  -- Create relationship tables
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer,
    "endorsers_id" integer,
    "insights_id" integer,
    "audience_id" integer,
    "media_id" integer,
    "contents_id" integer,
    "api_keys_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "users_id" integer,
    "endorsers_id" integer
  );
  `)

  // Finally, add foreign key constraints
  await db.execute(sql`
  DO $$
  BEGIN
    -- Add foreign key constraints
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'users_role_parent_fk'
    ) THEN
      ALTER TABLE "users_role" 
      ADD CONSTRAINT "users_role_parent_fk" 
      FOREIGN KEY ("parent_id") REFERENCES "users"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'users_profile_picture_id_media_id_fk'
    ) THEN
      ALTER TABLE "users" 
      ADD CONSTRAINT "users_profile_picture_id_media_id_fk" 
      FOREIGN KEY ("profile_picture_id") REFERENCES "media"("id") 
      ON DELETE set null ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'endorsers_audience_stats_stats_employment_parent_id_fk'
    ) THEN
      ALTER TABLE "endorsers_audience_stats_stats_employment" 
      ADD CONSTRAINT "endorsers_audience_stats_stats_employment_parent_id_fk" 
      FOREIGN KEY ("_parent_id") REFERENCES "endorsers"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
    
    -- Add other foreign key constraints
    
    -- Add foreign keys for payload_locked_documents_rels
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'payload_locked_documents_rels_parent_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels" 
      ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" 
      FOREIGN KEY ("parent_id") REFERENCES "payload_locked_documents"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'payload_locked_documents_rels_users_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels" 
      ADD CONSTRAINT "payload_locked_documents_rels_users_fk" 
      FOREIGN KEY ("users_id") REFERENCES "users"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'payload_locked_documents_rels_endorsers_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels" 
      ADD CONSTRAINT "payload_locked_documents_rels_endorsers_fk" 
      FOREIGN KEY ("endorsers_id") REFERENCES "endorsers"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'payload_locked_documents_rels_insights_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels" 
      ADD CONSTRAINT "payload_locked_documents_rels_insights_fk" 
      FOREIGN KEY ("insights_id") REFERENCES "insights"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'payload_locked_documents_rels_audience_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels" 
      ADD CONSTRAINT "payload_locked_documents_rels_audience_fk" 
      FOREIGN KEY ("audience_id") REFERENCES "audience"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'payload_locked_documents_rels_media_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels" 
      ADD CONSTRAINT "payload_locked_documents_rels_media_fk" 
      FOREIGN KEY ("media_id") REFERENCES "media"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'payload_locked_documents_rels_contents_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels" 
      ADD CONSTRAINT "payload_locked_documents_rels_contents_fk" 
      FOREIGN KEY ("contents_id") REFERENCES "contents"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'payload_locked_documents_rels_api_keys_fk'
    ) THEN
      ALTER TABLE "payload_locked_documents_rels" 
      ADD CONSTRAINT "payload_locked_documents_rels_api_keys_fk" 
      FOREIGN KEY ("api_keys_id") REFERENCES "api_keys"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
    
    -- Add foreign keys for payload_preferences_rels
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'payload_preferences_rels_parent_fk'
    ) THEN
      ALTER TABLE "payload_preferences_rels" 
      ADD CONSTRAINT "payload_preferences_rels_parent_fk" 
      FOREIGN KEY ("parent_id") REFERENCES "payload_preferences"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'payload_preferences_rels_users_fk'
    ) THEN
      ALTER TABLE "payload_preferences_rels" 
      ADD CONSTRAINT "payload_preferences_rels_users_fk" 
      FOREIGN KEY ("users_id") REFERENCES "users"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'payload_preferences_rels_endorsers_fk'
    ) THEN
      ALTER TABLE "payload_preferences_rels" 
      ADD CONSTRAINT "payload_preferences_rels_endorsers_fk" 
      FOREIGN KEY ("endorsers_id") REFERENCES "endorsers"("id") 
      ON DELETE cascade ON UPDATE no action;
    END IF;
  END
  $$;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_role" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "endorsers_audience_stats_stats_employment" CASCADE;
  DROP TABLE "endorsers_audience_stats_stats_income" CASCADE;
  DROP TABLE "endorsers_audience_stats_stats_experience" CASCADE;
  DROP TABLE "endorsers_audience_stats_stats_location" CASCADE;
  DROP TABLE "endorsers_audience_stats_stats_worth" CASCADE;
  DROP TABLE "endorsers" CASCADE;
  DROP TABLE "endorsers_rels" CASCADE;
  DROP TABLE "insights" CASCADE;
  DROP TABLE "_insights_v" CASCADE;
  DROP TABLE "audience" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "contents" CASCADE;
  DROP TABLE "api_keys" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_insights_insight_location";
  DROP TYPE "public"."enum_insights_review_status";
  DROP TYPE "public"."enum_insights_state";
  DROP TYPE "public"."enum_insights_status";
  DROP TYPE "public"."enum__insights_v_version_insight_location";
  DROP TYPE "public"."enum__insights_v_version_review_status";
  DROP TYPE "public"."enum__insights_v_version_state";
  DROP TYPE "public"."enum__insights_v_version_status";
  DROP TYPE "public"."enum_audience_employment_status";
  DROP TYPE "public"."enum_audience_income_range";
  DROP TYPE "public"."enum_audience_investment_experience";
  DROP TYPE "public"."enum_audience_net_worth";
  DROP TYPE "public"."enum_audience_status";`)
}
