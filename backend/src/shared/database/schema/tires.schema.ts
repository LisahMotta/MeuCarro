import { pgTable, uuid, integer, timestamp, text, decimal, date, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { vehicles } from './vehicles.schema';

export const tirePositionEnum = pgEnum('tire_position', ['FL', 'FR', 'RL', 'RR', 'spare']);
export const tireStatusEnum = pgEnum('tire_status', ['active', 'replaced', 'spare']);
export const tireEventTypeEnum = pgEnum('tire_event_type', ['rotation', 'calibration', 'repair', 'replacement']);

export const tires = pgTable('tires', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  brand: varchar('brand', { length: 50 }),
  model: varchar('model', { length: 100 }),
  size: varchar('size', { length: 20 }),
  dot: varchar('dot', { length: 8 }),
  purchasePrice: decimal('purchase_price', { precision: 10, scale: 2 }),
  purchaseDate: date('purchase_date'),
  installKm: integer('install_km'),
  position: tirePositionEnum('position'),
  estimatedLifeKm: integer('estimated_life_km'),
  status: tireStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  vehicleIdx: index('tires_vehicle_idx').on(table.vehicleId),
}));

export const tireEvents = pgTable('tire_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  tireId: uuid('tire_id').references(() => tires.id, { onDelete: 'set null' }),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  odometer: integer('odometer'),
  type: tireEventTypeEnum('type').notNull(),
  pressureFL: decimal('pressure_fl', { precision: 4, scale: 1 }),
  pressureFR: decimal('pressure_fr', { precision: 4, scale: 1 }),
  pressureRL: decimal('pressure_rl', { precision: 4, scale: 1 }),
  pressureRR: decimal('pressure_rr', { precision: 4, scale: 1 }),
  cost: decimal('cost', { precision: 10, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Tire = typeof tires.$inferSelect;
export type NewTire = typeof tires.$inferInsert;
export type TireEvent = typeof tireEvents.$inferSelect;
