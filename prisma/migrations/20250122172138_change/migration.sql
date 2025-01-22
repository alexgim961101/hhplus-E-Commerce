/*
  Warnings:

  - You are about to drop the `PointPaymentLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Orders` MODIFY `couponId` INTEGER NULL;

-- DropTable
DROP TABLE `PointPaymentLink`;
