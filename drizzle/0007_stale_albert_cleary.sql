-- Add slug column as nullable first
ALTER TABLE "properties" ADD COLUMN "slug" text;

-- Generate slugs for existing properties
UPDATE "properties" SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE("name", '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));

-- Now make it NOT NULL
ALTER TABLE "properties" ALTER COLUMN "slug" SET NOT NULL;

-- Add unique constraint
ALTER TABLE "properties" ADD CONSTRAINT "properties_slug_unique" UNIQUE("slug");
