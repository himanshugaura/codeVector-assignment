-- CreateEnum
CREATE TYPE "Category" AS ENUM ('electronics', 'grocery', 'cosmetic', 'clothing', 'books', 'furniture', 'sports', 'toys', 'automotive', 'jewelry');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_updatedAt_id_idx" ON "Product"("updatedAt" DESC, "id" DESC);

-- CreateIndex
CREATE INDEX "Product_category_updatedAt_id_idx" ON "Product"("category", "updatedAt" DESC, "id" DESC);
