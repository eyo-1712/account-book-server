/*
  Warnings:

  - You are about to drop the column `card` on the `Summary` table. All the data in the column will be lost.
  - Added the required column `account` to the `Summary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Summary` DROP COLUMN `card`,
    ADD COLUMN `account` VARCHAR(191) NOT NULL;
