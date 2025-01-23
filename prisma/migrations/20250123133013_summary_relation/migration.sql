/*
  Warnings:

  - You are about to drop the column `account` on the `Summary` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Summary` table. All the data in the column will be lost.
  - Added the required column `accountId` to the `Summary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `Summary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Summary` DROP COLUMN `account`,
    DROP COLUMN `category`,
    ADD COLUMN `accountId` INTEGER NOT NULL,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    MODIFY `money` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Summary` ADD CONSTRAINT `Summary_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Summary` ADD CONSTRAINT `Summary_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
