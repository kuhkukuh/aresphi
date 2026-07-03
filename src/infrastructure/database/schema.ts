import { integer, pgTable, text, timestamp, boolean, real } from 'drizzle-orm/pg-core';

export const stats = pgTable('stats', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  key: text('key').notNull().unique(),
  value: integer('value').notNull(),
  suffix: text('suffix').notNull().default('+'),
  label: text('label').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
});

export type Stat = typeof stats.$inferSelect;
export type NewStat = typeof stats.$inferInsert;

export const properties = pgTable('properties', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  price: text('price').notNull(),
  propertyType: text('property_type', { enum: ['rumah', 'apartemen', 'villa', 'ruko'] }).notNull().default('rumah'),
  landArea: integer('land_area'),
  buildingArea: integer('building_area'),
  description: text('description'),
  showInShowcase: boolean('show_in_showcase').notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;

export const propertyPhotos = pgTable('property_photos', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  propertyId: integer('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  alt: text('alt').notNull().default(''),
  displayOrder: integer('display_order').notNull().default(0),
});

export type PropertyPhoto = typeof propertyPhotos.$inferSelect;
export type NewPropertyPhoto = typeof propertyPhotos.$inferInsert;

export const heroPhotos = pgTable('hero_photos', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  url: text('url').notNull(),
  alt: text('alt').notNull().default(''),
  position: integer('position').notNull().unique(),
});

export type HeroPhoto = typeof heroPhotos.$inferSelect;
export type NewHeroPhoto = typeof heroPhotos.$inferInsert;

export const testimonials = pgTable('testimonials', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  quote: text('quote').notNull(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export const socials = pgTable('socials', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  phone: text('phone'),
  email: text('email'),
  addressLine1: text('address_line_1'),
  addressLine2: text('address_line_2'),
  instagram: text('instagram'),
  linkedin: text('linkedin'),
});

export type Social = typeof socials.$inferSelect;
export type NewSocial = typeof socials.$inferInsert;
