-- AlterTable
ALTER TABLE `Account` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Category` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Summary` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;
