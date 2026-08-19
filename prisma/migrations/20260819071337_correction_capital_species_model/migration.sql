/*
  Warnings:

  - Changed the type of `military` on the `species` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "species" DROP COLUMN "military",
ADD COLUMN     "military" JSONB NOT NULL;
