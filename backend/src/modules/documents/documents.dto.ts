import { z } from 'zod';

export const createDocumentSchema = z.object({
  type: z.enum(['insurance', 'ipva', 'licensing', 'fine', 'inspection', 'crlv', 'other']),
  title: z.string().min(1).max(100),
  issuer: z.string().max(100).optional(),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  value: z.number().min(0).optional(),
  status: z.enum(['active', 'expired', 'cancelled']).default('active'),
  notes: z.string().max(500).optional(),
});

export const updateDocumentSchema = createDocumentSchema.partial();

export type CreateDocumentDto = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentDto = z.infer<typeof updateDocumentSchema>;
