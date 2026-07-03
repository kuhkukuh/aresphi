CREATE TABLE "socials" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "socials_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"phone" text,
	"email" text,
	"address_line_1" text,
	"address_line_2" text,
	"instagram" text,
	"linkedin" text
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "testimonials_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"quote" text NOT NULL,
	"emphasis" text NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "property_type" text DEFAULT 'rumah' NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "land_area" integer;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "building_area" integer;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "description" text;