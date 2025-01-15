-- AlterTable
ALTER TABLE `Coupon` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `CouponHistory` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `OrderProduct` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Orders` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Payment` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `PointHistory` MODIFY `updatedAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `updatedAt` DATETIME(3) NULL;
