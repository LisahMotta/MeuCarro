import { pgTable, uuid, timestamp, text, decimal, date, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';
import { vehicles } from './vehicles.schema';

export const documentTypeEnum = pgEnum('document_type', ['insurance', 'ipva', 'licensing', 'fine', 'inspection', 'crlv', 'other']);
export const documentStatusEnum = pgEnum('document_status', ['active', 'expired', 'cancelled']);

export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
  type: documentTypeEnum('type').notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  issuer: varchar('issuer', { length: 100 }),
  issueDate: date('issue_date'),
  expiryDate: date('expiry_date'),
  value: decimal('value', { precision: 10, scale: 2 }),
  status: documentStatusEnum('status').default('active').notNull(),
  fileUrl: text('file_url'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  vehicleTypeIdx: index('documents_vehicle_type_idx').on(table.vehicleId, table.type),
  vehicleExpiryIdx: index('documents_vehicle_expiry_idx').on(table.vehicleId, table.expiryDate),
}));

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
