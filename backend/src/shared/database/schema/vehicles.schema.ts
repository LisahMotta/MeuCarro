import { pgTable, uuid, varchar, integer, timestamp, pgEnum, boolean, text, decimal } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { users } from './users.schema';

export const fuelTypeEnum = pgEnum('fuel_type', ['gasoline', 'ethanol', 'flex', 'diesel', 'electric', 'hybrid']);

export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  brand: varchar('brand', { length: 50 }).notNull(),
  model: varchar('model', { length: 50 }).notNull(),
  year: integer('year').notNull(),
  version: varchar('version', { length: 100 }),
  plate: varchar('plate', { length: 10 }),
  chassis: varchar('chassis', { length: 17 }),
  renavam: varchar('renavam', { length: 11 }),
  color: varchar('color', { length: 30 }),
  currentKm: integer('current_km').default(0).notNull(),
  fuelType: fuelTypeEnum('fuel_type').default('flex').notNull(),
  tankCapacity: decimal('tank_capacity', { precision: 5, scale: 2 }),
  oilType: varchar('oil_type', { length: 50 }),
  oilQuantity: decimal('oil_quantity', { precision: 3, scale: 1 }),
  tireSize: varchar('tire_size', { length: 20 }),
  photoUrl: text('photo_url'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('vehicles_user_id_idx').on(table.userId),
  plateIdx: index('vehicles_plate_idx').on(table.plate),
}));

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
