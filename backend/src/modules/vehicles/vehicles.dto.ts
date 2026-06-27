import { z } from 'zod';

export const createVehicleSchema = z.object({
  brand: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  version: z.string().max(100).optional(),
  plate: z.string().max(10).optional(),
  chassis: z.string().max(17).optional(),
  renavam: z.string().max(11).optional(),
  color: z.string().max(30).optional(),
  currentKm: z.number().int().min(0).default(0),
  fuelType: z.enum(['gasoline', 'ethanol', 'flex', 'diesel', 'electric', 'hybrid']).default('flex'),
  tankCapacity: z.number().min(0).max(999).optional(),
  oilType: z.string().max(50).optional(),
  oilQuantity: z.number().min(0).max(99).optional(),
  tireSize: z.string().max(20).optional(),
});

export const updateVehicleSchema = createVehicleSchema.partial();

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleDto = z.infer<typeof updateVehicleSchema>;
