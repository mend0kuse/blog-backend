-- DropForeignKey
ALTER TABLE `articlestats` DROP FOREIGN KEY `ArticleStats_articleId_fkey`;

-- AlterTable
ALTER TABLE `articlestats` MODIFY `articleId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ArticleStats` ADD CONSTRAINT `ArticleStats_articleId_fkey` FOREIGN KEY (`articleId`) REFERENCES `Article`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
