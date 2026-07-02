import { integer, pgTable, text } from 'drizzle-orm/pg-core';

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
