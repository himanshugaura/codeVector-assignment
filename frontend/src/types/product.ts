export type Category =
  | 'electronics'
  | 'grocery'
  | 'cosmetic'
  | 'clothing'
  | 'books'
  | 'furniture'
  | 'sports'
  | 'toys'
  | 'automotive'
  | 'jewelry';

export const CATEGORIES: Category[] = [
  'electronics',
  'grocery',
  'cosmetic',
  'clothing',
  'books',
  'furniture',
  'sports',
  'toys',
  'automotive',
  'jewelry',
];

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse {
  items: Product[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: PaginatedResponse;
}

// ─── Category display config ───────────────────────────────────────────────────

export interface CategoryStyle {
  label: string;
  color: string;     
  bg: string;        
}

export const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
  electronics: { label: 'Electronics', color: '#9CB080', bg: 'rgba(156, 176, 128, 0.12)' },
  grocery:     { label: 'Grocery',     color: '#618764', bg: 'rgba(97, 135, 100, 0.12)' },
  cosmetic:    { label: 'Cosmetic',    color: '#9CB080', bg: 'rgba(156, 176, 128, 0.12)' },
  clothing:    { label: 'Clothing',    color: '#618764', bg: 'rgba(97, 135, 100, 0.12)' },
  books:       { label: 'Books',       color: '#9CB080', bg: 'rgba(156, 176, 128, 0.12)' },
  furniture:   { label: 'Furniture',   color: '#618764', bg: 'rgba(97, 135, 100, 0.12)' },
  sports:      { label: 'Sports',      color: '#9CB080', bg: 'rgba(156, 176, 128, 0.12)' },
  toys:        { label: 'Toys',        color: '#618764', bg: 'rgba(97, 135, 100, 0.12)' },
  automotive:  { label: 'Automotive',  color: '#9CB080', bg: 'rgba(156, 176, 128, 0.12)' },
  jewelry:     { label: 'Jewelry',     color: '#618764', bg: 'rgba(97, 135, 100, 0.12)' },
};
