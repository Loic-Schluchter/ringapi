/*
  Warnings:

  - Changed the type of `avgheight` on the `species` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `avgweight` on the `species` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `avglifespan` on the `species` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "species" DROP COLUMN "avgheight",
ADD COLUMN     "avgheight" JSONB NOT NULL,
DROP COLUMN "avgweight",
ADD COLUMN     "avgweight" JSONB NOT NULL,
DROP COLUMN "avglifespan",
ADD COLUMN     "avglifespan" JSONB NOT NULL;
