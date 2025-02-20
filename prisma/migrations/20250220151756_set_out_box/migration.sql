-- AlterTable
ALTER TABLE `PointHistory` ADD COLUMN `paymentId` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `version` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `OutBox` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `topic` VARCHAR(255) NOT NULL,
    `key` VARCHAR(255) NULL,
    `message` MEDIUMBLOB NOT NULL,
    `status` ENUM('queued', 'processed', 'skipped') NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
