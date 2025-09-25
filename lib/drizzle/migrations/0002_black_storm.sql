-- Migration to modify Plan table structure and remove PlanLimit table

-- Step 1: Create a new Plan table with integer ID and allowedTemplates field
CREATE TABLE "Plan_new" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"planType" text NOT NULL,
	"allowedTemplates" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "Plan_new_name_unique" UNIQUE("name")
);

-- Step 2: Migrate data from old Plan table to new Plan table, merging PlanLimit data
-- We'll use ROW_NUMBER() to generate sequential IDs starting from 1
INSERT INTO "Plan_new" ("name", "description", "createdAt", "updatedAt", "planType", "allowedTemplates")
SELECT 
	"Plan"."name",
	"Plan"."description", 
	"Plan"."createdAt",
	"Plan"."updatedAt",
	"Plan"."planType",
	COALESCE("PlanLimit"."allowedTemplates", '{}'::jsonb)
FROM "Plan"
LEFT JOIN "PlanLimit" ON "Plan"."id" = "PlanLimit"."planId"
ORDER BY "Plan"."id";

-- Step 3: Create a mapping table to track old text IDs to new integer IDs
CREATE TEMP TABLE plan_id_mapping AS
SELECT 
	old_plan."id" as old_id,
	new_plan."id" as new_id
FROM "Plan" old_plan
JOIN "Plan_new" new_plan ON old_plan."name" = new_plan."name";

-- Step 4: Update User table foreign key references using the mapping
UPDATE "User" 
SET "planId" = mapping.new_id::text
FROM plan_id_mapping mapping
WHERE "User"."planId" = mapping.old_id;

-- Step 5: Drop foreign key constraint on User table
ALTER TABLE "User" DROP CONSTRAINT IF EXISTS "User_planId_Plan_id_fk";

-- Step 6: Drop the old Plan and PlanLimit tables
DROP TABLE IF EXISTS "PlanLimit";
DROP TABLE IF EXISTS "Plan";

-- Step 7: Rename the new Plan table
ALTER TABLE "Plan_new" RENAME TO "Plan";

-- Step 8: Alter User table to use integer planId and recreate foreign key constraint
-- First drop the default, then change type, then set new default
ALTER TABLE "User" ALTER COLUMN "planId" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "planId" TYPE integer USING CAST("planId" AS INTEGER);
ALTER TABLE "User" ALTER COLUMN "planId" SET DEFAULT 1;
ALTER TABLE "User" ADD CONSTRAINT "User_planId_Plan_id_fk" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE set null ON UPDATE cascade;