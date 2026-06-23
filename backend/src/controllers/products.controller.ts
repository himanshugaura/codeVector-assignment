import { fetchProducts } from '../services/product.service.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { decodeCursor } from '../utils/cursor.js';
import { productQuerySchema } from '../validators/product.validator.js';

export const getAllProducts = asyncHandler(async (req, res) => {
  const result = productQuerySchema.safeParse(req.query);

  if (!result.success) {
    const messages = result.error.issues.map((issue) => issue.message);
    throw new ApiError(400, 'Invalid query parameters.', messages);
  }

  const { cursor: cursorToken, limit, category } = result.data;

  const cursor = cursorToken !== undefined ? decodeCursor(cursorToken) : null;

  return fetchProducts({ cursor, limit, category: category ?? null }).then(
    (data) => new ApiResponse(200, data, 'Products fetched successfully').send(res),
  );
});