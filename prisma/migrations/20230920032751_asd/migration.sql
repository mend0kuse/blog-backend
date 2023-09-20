/*
  Warnings:

  - You are about to alter the column `likes` on the `articlestats` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `dislikes` on the `articlestats` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `articlestats` MODIFY `likes` INTEGER NOT NULL,
    MODIFY `dislikes` INTEGER NOT NULL;
