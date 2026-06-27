import { z } from 'zod';

export const maintenanceCategoryValues = [
  'oil_change', 'oil_filter', 'air_filter', 'fuel_filter', 'brake_pads',
  'brake_disc', 'brake_fluid', 'suspension', 'shock_absorber', 'alignment',
  'balancing', 'rotation', 'tires', 'clutch', 'transmission', 'steering',
  'battery', 'timing_belt', 'air_conditioning', 'engine', 'electrical',
  'body_repair', 'washing', 'general_revision', 'other'
] as const;

export const createMaintenanceSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  odometer: z.number().int().min(0),
  category: z.enum(maintenanceCategoryValues),
  shopName: z.string().max(100).optional(),
  mechanicName: z.string().max(100).optional(),
  laborCost: z.number().min(0).default(0),
  partsCost: z.number().min(0).default(0),
  totalCost: z.number().min(0),
  warrantyUntil: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  nextServiceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  nextServiceKm: z.number().int().min(0).optional(),
  notes: z.string().max(1000).optional(),
  status: z.enum(['completed', 'scheduled', 'overdue']).default('completed'),
});

export const updateMaintenanceSchema = createMaintenanceSchema.partial();

export type CreateMaintenanceDto = z.infer<typeof createMaintenanceSchema>;
export type UpdateMaintenanceDto = z.infer<typeof updateMaintenanceSchema>;
