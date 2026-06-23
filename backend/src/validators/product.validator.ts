import { Category } from '@prisma/client';
import { z } from 'zod';

export const productQuerySchema = z.object({
  cursor: z.string().optional(),

  limit: z.coerce
    .number({ error: '`limit` must be a numeric value.' })
    .int({ error: '`limit` must be an integer.' })
    .min(1, { error: '`limit` must be at least 1.' })
    .max(100, { error: '`limit` must not exceed 100.' })
    .default(20),

  category: z.enum(Category).optional(),
});

export type ProductQueryInput = z.infer<typeof productQuerySchema>;
