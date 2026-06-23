import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wraps an async Express route handler so that any rejected promise is
 * forwarded to the global error middleware via `next(err)`.
 *
 * Without this wrapper every async handler would need its own try/catch,
 * which is repetitive and easy to forget.
 *
 * Note: the inner function is typed as returning `unknown` (not `void`) so
 * that handlers returning Promises (e.g. via `.then()`) are accepted without
 * a TypeScript error.
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown,
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};