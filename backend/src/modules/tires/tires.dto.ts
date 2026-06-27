import { z } from 'zod';

export const createTireSchema = z.object({
  brand: z.string().max(50).optional(),
  model: z.string().max(100).optional(),
  size: z.string().max(20).optional(),
  dot: z.string().max(8).optional(),
  purchasePrice: z.number().min(0).optional(),
  purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  installKm: z.number().int().min(0).optional(),
  position: z.enum(['FL', 'FR', 'RL', 'RR', 'spare']).optional(),
  estimatedLifeKm: z.number().int().min(0).optional(),
  status: z.enum(['active', 'replaced', 'spare']).default('active'),
});

export const createTireEventSchema = z.object({
  tireId: z.string().uuid().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  odometer: z.number().int().min(0).optional(),
  type: z.enum(['rotation', 'calibration', 'repair', 'replacement']),
  pressureFL: z.number().min(0).max(99).optional(),
  pressureFR: z.number().min(0).max(99).optional(),
  pressureRL: z.number().min(0).max(99).optional(),
  pressureRR: z.number().min(0).max(99).optional(),
  cost: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
});

export const updateTireSchema = createTireSchema.partial();

export type CreateTireDto = z.infer<typeof createTireSchema>;
export type UpdateTireDto = z.infer<typeof updateTireSchema>;
export type CreateTireEventDto = z.infer<typeof createTireEventSchema>;
