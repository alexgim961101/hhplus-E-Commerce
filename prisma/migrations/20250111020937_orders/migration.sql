/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_couponId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_userId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderProduct` DROP FOREIGN KEY `OrderProduct_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_orderId_fkey`;

-- DropIndex
DROP INDEX `OrderProduct_orderId_fkey` ON `OrderProduct`;

-- DropIndex
DROP INDEX `Payment_orderId_fkey` ON `Payment`;

-- DropTable
DROP TABLE `Order`;

-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `couponId` INTEGER NOT NULL,
    `orderSubtotal` INTEGER NOT NULL,
    `discount` INTEGER NOT NULL,
    `orderTotal` INTEGER NOT NULL,
    `orderStatus` ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `OrderProduct` ADD CONSTRAINT `OrderProduct_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
