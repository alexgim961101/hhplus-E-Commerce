-- DropForeignKey
ALTER TABLE `CouponHistory` DROP FOREIGN KEY `CouponHistory_couponId_fkey`;

-- DropForeignKey
ALTER TABLE `CouponHistory` DROP FOREIGN KEY `CouponHistory_userId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderProduct` DROP FOREIGN KEY `OrderProduct_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderProduct` DROP FOREIGN KEY `OrderProduct_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_couponId_fkey`;

-- DropForeignKey
ALTER TABLE `Orders` DROP FOREIGN KEY `Orders_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `PointHistory` DROP FOREIGN KEY `PointHistory_userId_fkey`;

-- DropForeignKey
ALTER TABLE `PointPaymentLink` DROP FOREIGN KEY `PointPaymentLink_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `PointPaymentLink` DROP FOREIGN KEY `PointPaymentLink_pointHistoryId_fkey`;

-- DropIndex
DROP INDEX `CouponHistory_couponId_fkey` ON `CouponHistory`;

-- DropIndex
DROP INDEX `CouponHistory_userId_fkey` ON `CouponHistory`;

-- DropIndex
DROP INDEX `OrderProduct_orderId_fkey` ON `OrderProduct`;

-- DropIndex
DROP INDEX `OrderProduct_productId_fkey` ON `OrderProduct`;

-- DropIndex
DROP INDEX `Orders_couponId_fkey` ON `Orders`;

-- DropIndex
DROP INDEX `Orders_userId_fkey` ON `Orders`;

-- DropIndex
DROP INDEX `Payment_orderId_fkey` ON `Payment`;

-- DropIndex
DROP INDEX `PointHistory_userId_fkey` ON `PointHistory`;

-- DropIndex
DROP INDEX `PointPaymentLink_paymentId_fkey` ON `PointPaymentLink`;

-- DropIndex
DROP INDEX `PointPaymentLink_pointHistoryId_fkey` ON `PointPaymentLink`;
