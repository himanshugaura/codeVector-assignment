import type { Product } from '@prisma/client';

import { findProductsPage } from '../repositories/product.repository.js';
import type { FetchProductsInput, PaginatedProducts } from '../types/product.types.js';
import { encodeCursor } from '../utils/cursor.js';

export async function fetchProducts(
  input: FetchProductsInput,
): Promise<PaginatedProducts<Product>> {
  const { cursor, limit, category } = input;

  const rows = await findProductsPage(cursor, limit + 1, category);

  const hasNextPage = rows.length > limit;

  const items = hasNextPage ? rows.slice(0, limit) : rows;

  const lastItem = items.at(-1);
  const nextCursor =
    hasNextPage && lastItem !== undefined
      ? encodeCursor(lastItem.updatedAt, lastItem.id)
      : null;

  return { items, nextCursor, hasNextPage };
};
