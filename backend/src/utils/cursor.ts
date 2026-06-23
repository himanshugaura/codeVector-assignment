import type { DecodedCursor } from '../types/product.types.js';


export function encodeCursor(updatedAt: Date, id: number): string {
  const payload: DecodedCursor = { updatedAt: updatedAt.toISOString(), id };
  return Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
}


export function decodeCursor(token: string): DecodedCursor | null {
  try {
    const json = Buffer.from(token, 'base64url').toString('utf-8');
    const parsed: unknown = JSON.parse(json);

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('updatedAt' in parsed) ||
      !('id' in parsed) ||
      typeof (parsed as Record<string, unknown>).updatedAt !== 'string' ||
      typeof (parsed as Record<string, unknown>).id !== 'number'
    ) {
      return null;
    }

    return parsed as DecodedCursor;
  } catch {
    return null;
  }
}
