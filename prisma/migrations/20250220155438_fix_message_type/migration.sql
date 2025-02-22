/*
  Warnings:

  - You are about to alter the column `message` on the `OutBox` table. The data in that column could be lost. The data in that column will be cast from `MediumBlob` to `Text`.

*/
-- AlterTable
ALTER TABLE `OutBox` MODIFY `message` TEXT NOT NULL;
