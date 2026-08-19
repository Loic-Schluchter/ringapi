/*
  Warnings:

  - Changed the type of `capital` on the `species` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "species" DROP COLUMN "capital",
ADD COLUMN     "capital" JSONB NOT NULL;
