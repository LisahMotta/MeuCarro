import { pgTable, uuid, integer, timestamp, text, decimal, date, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { vehicles } from './vehicles.schema';

export const maintenanceCategoryEnum = pgEnum('maintenance_category', [
  'oil_change', 'oil_filter', 'air_filter', 'fuel_filter', 'brake_pads',
  'brake_disc', 'brake_fluid', 'suspension', 'shock_absorber', 'alignment',
  'balancing', 'rotation', 'tires', 'clutch', 'transmission', 'steering',
  'battery', 'timing_belt', 'air_conditioning', 'engine', 'electrical',
  'body_repair', 'washing', 'general_revision', 'other'
]);

export const maintenanceStatusEnum = pgEnum('maintenance_status', ['completed', 'scheduled', 'overdue']);

export const maintenances = pgTable('maintenances', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  odometer: integer('odometer').notNull(),
  category: maintenanceCategoryEnum('category').notNull(),
  shopName: varchar('shop_name', { length: 100 }),
  mechanicName: varchar('mechanic_name', { length: 100 }),
  laborCost: decimal('labor_cost', { precision: 10, scale: 2 }).default('0'),
  partsCost: decimal('parts_cost', { precision: 10, scale: 2 }).default('0'),
  totalCost: decimal('total_cost', { precision: 10, scale: 2 }).notNull(),
  warrantyUntil: date('warranty_until'),
  nextServiceDate: date('next_service_date'),
  nextServiceKm: integer('next_service_km'),
  notes: text('notes'),
  status: maintenanceStatusEnum('status').default('completed').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  vehicleDateIdx: index('maintenances_vehicle_date_idx').on(table.vehicleId, table.date),
  vehicleCategoryIdx: index('maintenances_vehicle_category_idx').on(table.vehicleId, table.category),
  vehicleNextKmIdx: index('maintenances_vehicle_next_km_idx').on(table.vehicleId, table.nextServiceKm),
}));

export const maintenanceAttachments = pgTable('maintenance_attachments', {
  id: uuid('id').primaryKey().defaultRandom(),
  maintenanceId: uuid('maintenance_id').notNull().references(() => maintenances.id, { onDelete: 'cascade' }),
  type: pgEnum('attachment_type', ['photo', 'invoice', 'other'])('type').notNull(),
  url: text('url').notNull(),
  filename: varchar('filename', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Maintenance = typeof maintenances.$inferSelect;
export type NewMaintenance = typeof maintenances.$inferInsert;
export type MaintenanceAttachment = typeof maintenanceAttachments.$inferSelect;
