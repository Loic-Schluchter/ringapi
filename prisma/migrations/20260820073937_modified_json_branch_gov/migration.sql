/*
  Warnings:

  - The `executiveBranch` column on the `government` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `legislativeBranch` column on the `government` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `militaryBranch` column on the `government` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "government" DROP COLUMN "executiveBranch",
ADD COLUMN     "executiveBranch" JSONB,
DROP COLUMN "legislativeBranch",
ADD COLUMN     "legislativeBranch" JSONB,
DROP COLUMN "militaryBranch",
ADD COLUMN     "militaryBranch" JSONB;
