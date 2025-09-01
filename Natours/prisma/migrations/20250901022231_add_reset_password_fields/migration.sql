-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `reset_attempts` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `reset_blocked_until` DATETIME(3) NULL,
    ADD COLUMN `reset_code` VARCHAR(6) NULL,
    ADD COLUMN `reset_code_expires` DATETIME(6) NULL;
