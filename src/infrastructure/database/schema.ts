import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

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
  price: text('price').notNull(),
  status: text('status', { enum: ['available', 'sold', 'rented'] }).notNull().default('available'),
  showInShowcase: integer('show_in_showcase', { mode: 'boolean' }).notNull().default(false),
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
