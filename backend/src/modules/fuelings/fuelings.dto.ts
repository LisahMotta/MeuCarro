import { z } from 'zod';

export const createFuelingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  odometer: z.number().int().min(0),
  stationName: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  fuelType: z.enum(['gasoline', 'ethanol', 'flex', 'diesel', 'electric', 'hybrid']),
  liters: z.number().min(0.001).max(9999),
  pricePerLiter: z.number().min(0.001).max(99),
  totalCost: z.number().min(0.01),
  fullTank: z.boolean().default(false),
  partialTank: z.boolean().default(false),
  notes: z.string().max(500).optional(),
});

export const updateFuelingSchema = createFuelingSchema.partial();

export type CreateFuelingDto = z.infer<typeof createFuelingSchema>;
export type UpdateFuelingDto = z.infer<typeof updateFuelingSchema>;
