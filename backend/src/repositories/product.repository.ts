import type { Category, Product } from '@prisma/client';

import { prisma } from '../config/prisma.js';
import type { DecodedCursor } from '../types/product.types.js';

export async function findProductsPage(
  cursor: DecodedCursor | null,
  limit: number,
  category: Category | null,
): Promise<Product[]> {
  return prisma.product.findMany({
    where: {
      ...(category !== null && { category }),
      ...(cursor !== null && {
        OR: [
          { updatedAt: { lt: new Date(cursor.updatedAt) } },
          {
            updatedAt: { equals: new Date(cursor.updatedAt) },
            id: { lt: cursor.id },
          },
        ],
      }),
    },

    orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
    take: limit,
  });
}
