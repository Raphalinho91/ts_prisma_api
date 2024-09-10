/*
  Warnings:

  - The values [ADMIN,USER_SELLER] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `tenants` ADD COLUMN `productId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `productId` VARCHAR(191) NULL,
    ADD COLUMN `tenantId` VARCHAR(191) NULL,
    MODIFY `role` ENUM('ADMIN_FULL_PRIVILEGE_FOR_ALL_APP', 'USER_SELLER_IS_ADMIN_FOR_HIS_TENANT', 'USER_CLIENT') NOT NULL DEFAULT 'USER_CLIENT';

-- CreateIndex
CREATE UNIQUE INDEX `products_userId_key` ON `products`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `tenants_userId_key` ON `tenants`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `tenants_productId_key` ON `tenants`(`productId`);

-- CreateIndex
CREATE UNIQUE INDEX `users_tenantId_key` ON `users`(`tenantId`);

-- CreateIndex
CREATE UNIQUE INDEX `users_productId_key` ON `users`(`productId`);
