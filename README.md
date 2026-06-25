# CodeVector Backend Task: Product Browser

This is my submission for the CodeVector backend engineering task. It implements a robust, cursor-paginated product browser designed to handle real-world scale (~200,000 records) without performance degradation.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm (or npm/yarn)
- PostgreSQL

### 1. Database & Seeding (Backend)
```bash
cd backend
pnpm install

# Generate 200,000 products (takes ~1 second)
pnpm run seed

# Start the API server on http://localhost:5000
pnpm run dev
```

### 2. Frontend
```bash
cd frontend
pnpm install

# Start the Next.js dev server on http://localhost:3000
pnpm run dev
```

---

## 🧠 What I Chose and Why (Architecture)

### 1. Cursor Pagination vs. Offset Pagination
The core requirement was to browse 200k products quickly and stably. 
I chose **Cursor Pagination** over traditional `SKIP / OFFSET` for two reasons:
1. **Performance:** `OFFSET N` tells the database to scan and discard `N` rows before returning data. Fetching page 1,000 takes significantly longer than page 1. Cursor pagination (`WHERE col < val`) uses B-Tree indexes directly, meaning fetching page 1,000 is an $O(\log N)$ operation—exactly as fast as page 1.
2. **Stability:** If 50 products are added while a user is on page 1, offset pagination shifts all items down. When the user clicks "Next Page" (`OFFSET 20`), they will see duplicates of items that were pushed onto page 2. Cursor pagination anchors to the exact last item seen, making it completely immune to data shifts.

### 2. The `(updatedAt, id)` Compound Cursor
The prompt requested "newest first", which implies sorting by a timestamp.
Using *only* `updatedAt` as a cursor is dangerous because timestamps can collide (multiple products created in the exact same millisecond). 
I used a **compound cursor** of `(updatedAt, id)`. The `id` acts as a deterministic tie-breaker. 

In SQL, this is expressed as a row-value comparison:
`(updatedAt, id) < (cursor_updatedAt, cursor_id)`

Because Prisma does not natively support row-value comparisons, I implemented its logical equivalent in `product.repository.ts`:
```ts
OR: [
  { updatedAt: { lt: cursorUpdatedAt } },
  { updatedAt: { equals: cursorUpdatedAt }, id: { lt: cursorId } }
]
```

### 3. Database Indexes
To make the cursor fast, I added the following composite B-Tree indexes in `schema.prisma`:
1. `@@index([updatedAt(sort: Desc), id(sort: Desc)])` — For the "All Products" view.
2. `@@index([category, updatedAt(sort: Desc), id(sort: Desc)])` — For the category-filtered view.
Without the category-prefixed index, filtering by category would force Postgres to seq-scan or filter the existing index in memory.

### 4. Optimized Seeding (200k Rows)
Instead of using Prisma's `createMany` in chunks (which requires shipping 200k JSON objects over the network and parsing them), I wrote a raw SQL query utilizing PostgreSQL's native `generate_series()`. This pushes the data generation entirely to the database engine, seeding all 200,000 rows in less than a second.
 

