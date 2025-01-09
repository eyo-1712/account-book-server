/*
  Warnings:

  - Added the required column `uid` to the `Summary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Summary` ADD COLUMN `uid` VARCHAR(191) NOT NULL;
