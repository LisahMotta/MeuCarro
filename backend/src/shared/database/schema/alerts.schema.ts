import { pgTable, uuid, timestamp, text, date, integer, boolean, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { vehicles } from './vehicles.schema';
import { users } from './users.schema';

export const alertTypeEnum = pgEnum('alert_type', [
  'oil_change', 'rotation', 'revision', 'timing_belt',
  'insurance', 'ipva', 'licensing', 'cnh', 'warranty', 'custom'
]);

export const alertSeverityEnum = pgEnum('alert_severity', ['info', 'warning', 'urgent', 'critical']);

export const alerts = pgTable('alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: alertTypeEnum('type').notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  severity: alertSeverityEnum('severity').default('info').notNull(),
  triggerDate: date('trigger_date'),
  triggerKm: integer('trigger_km'),
  referenceId: uuid('reference_id'),
  referenceType: varchar('reference_type', { length: 50 }),
  isRead: boolean('is_read').default(false).notNull(),
  isDismissed: boolean('is_dismissed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userReadIdx: index('alerts_user_read_idx').on(table.userId, table.isRead),
  vehicleDateIdx: index('alerts_vehicle_date_idx').on(table.vehicleId, table.triggerDate),
}));

export type Alert = typeof alerts.$inferSelect;
export type NewAlert = typeof alerts.$inferInsert;
