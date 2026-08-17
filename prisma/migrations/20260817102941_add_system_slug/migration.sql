/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `system` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `system` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "system_name_key";

-- AlterTable
ALTER TABLE "system" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "system_slug_key" ON "system"("slug");
