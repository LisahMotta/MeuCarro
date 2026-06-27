import { pgTable, uuid, integer, timestamp, boolean, text, decimal, date, varchar } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { vehicles } from './vehicles.schema';
import { fuelTypeEnum } from './vehicles.schema';

export const fuelings = pgTable('fuelings', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  odometer: integer('odometer').notNull(),
  stationName: varchar('station_name', { length: 100 }),
  city: varchar('city', { length: 100 }),
  fuelType: fuelTypeEnum('fuel_type').notNull(),
  liters: decimal('liters', { precision: 8, scale: 3 }).notNull(),
  pricePerLiter: decimal('price_per_liter', { precision: 8, scale: 3 }).notNull(),
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }).notNull(),
  fullTank: boolean('full_tank').default(false).notNull(),
  partialTank: boolean('partial_tank').default(false).notNull(),
  consumption: decimal('consumption', { precision: 6, scale: 3 }),
  autonomy: decimal('autonomy', { precision: 8, scale: 2 }),
  costPerKm: decimal('cost_per_km', { precision: 8, scale: 4 }),
  notes: text('notes'),
  receiptUrl: text('receipt_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  vehicleDateIdx: index('fuelings_vehicle_date_idx').on(table.vehicleId, table.date),
  vehicleOdometerIdx: index('fuelings_vehicle_odometer_idx').on(table.vehicleId, table.odometer),
}));

export type Fueling = typeof fuelings.$inferSelect;
export type NewFueling = typeof fuelings.$inferInsert;
