-- CreateTable
CREATE TABLE `ArticleStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `likes` BIGINT NOT NULL,
    `dislikes` BIGINT NOT NULL,
    `articleId` INTEGER NOT NULL,

    UNIQUE INDEX `ArticleStats_articleId_key`(`articleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ArticleStats` ADD CONSTRAINT `ArticleStats_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
