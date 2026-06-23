import type { Category } from '@prisma/client';



export interface ProductQueryParams {
  cursor?: string;   
  limit?: string;  
  category?: string;
}


export interface DecodedCursor {
  updatedAt: string;
  id: number;
}


export interface FetchProductsInput {
  cursor: DecodedCursor | null;
  limit: number;
  category: Category | null;
}


export interface PaginatedProducts<T> {
  items: T[];
  nextCursor: string | null; 
  hasNextPage: boolean;
}
