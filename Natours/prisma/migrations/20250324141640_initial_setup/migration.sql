-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `deleted_at` DATETIME(3) NULL,
    `first_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,

    INDEX `users_created_at_idx`(`created_at`),
    INDEX `users_updated_at_idx`(`updated_at`),
    INDEX `users_deleted_at_idx`(`deleted_at`),
    INDEX `users_first_name_idx`(`first_name`),
    INDEX `users_last_name_idx`(`last_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
