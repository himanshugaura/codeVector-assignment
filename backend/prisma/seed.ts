
import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const TOTAL_PRODUCTS = 200_000;

async function main(): Promise<void> {
  console.log(`🌱 Seeding ${TOTAL_PRODUCTS.toLocaleString()} products...`);

  const start = Date.now();

  await prisma.$executeRawUnsafe(`
    INSERT INTO "Product" (name, price, category, "createdAt", "updatedAt")
    SELECT
      'Product #' || (floor(random() * 10000) + 1)::int,

      (floor(random() * 9901) + 100)::int,

      (ARRAY[
        'electronics','grocery','cosmetic','clothing','books',
        'furniture','sports','toys','automotive','jewelry'
      ])[floor(random() * 10 + 1)]::"Category",

      NOW() - (random() * INTERVAL '2 years'),

      NOW() - (random() * INTERVAL '30 days')

    FROM generate_series(1, ${TOTAL_PRODUCTS});
  `);

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);

  const count = await prisma.product.count();
  console.log(`✅ Done in ${elapsed}s — ${count.toLocaleString()} total products in DB`);
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
