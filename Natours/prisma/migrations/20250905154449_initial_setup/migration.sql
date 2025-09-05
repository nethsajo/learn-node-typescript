-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `reset_code` VARCHAR(6) NULL,
    `reset_code_expires` TIMESTAMP(3) NULL,
    `reset_attempts` INTEGER NOT NULL DEFAULT 0,
    `reset_blocked_until` TIMESTAMP(3) NULL,

    UNIQUE INDEX `accounts_email_key`(`email`),
    UNIQUE INDEX `accounts_username_key`(`username`),
    INDEX `accounts_created_at_idx`(`created_at`),
    INDEX `accounts_updated_at_idx`(`updated_at`),
    INDEX `accounts_deleted_at_idx`(`deleted_at`),
    INDEX `accounts_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `refresh_token` VARCHAR(512) NOT NULL,
    `account_id` INTEGER NULL,

    UNIQUE INDEX `sessions_refresh_token_key`(`refresh_token`),
    INDEX `sessions_created_at_idx`(`created_at`),
    INDEX `sessions_updated_at_idx`(`updated_at`),
    INDEX `sessions_deleted_at_idx`(`deleted_at`),
    INDEX `sessions_account_id_idx`(`account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `account_id` INTEGER NULL,

    UNIQUE INDEX `users_account_id_key`(`account_id`),
    INDEX `users_created_at_idx`(`created_at`),
    INDEX `users_updated_at_idx`(`updated_at`),
    INDEX `users_deleted_at_idx`(`deleted_at`),
    INDEX `users_first_name_idx`(`first_name`),
    INDEX `users_last_name_idx`(`last_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
