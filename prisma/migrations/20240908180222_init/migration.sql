/*
  Warnings:

  - A unique constraint covering the columns `[tenantId]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `products_tenantId_key` ON `products`(`tenantId`);
