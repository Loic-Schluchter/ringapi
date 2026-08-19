/*
  Warnings:

  - You are about to drop the column `government` on the `planet` table. All the data in the column will be lost.
  - You are about to drop the column `species` on the `planet` table. All the data in the column will be lost.
  - You are about to alter the column `diameter` on the `planet` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `DoublePrecision`.
  - You are about to drop the column `species` on the `system` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "government" ADD COLUMN     "speciesId" INTEGER;

-- AlterTable
ALTER TABLE "planet" DROP COLUMN "government",
DROP COLUMN "species",
ALTER COLUMN "diameter" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "system" DROP COLUMN "species",
ADD COLUMN     "speciesId" INTEGER;

-- CreateTable
CREATE TABLE "species" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "aliases" TEXT NOT NULL,
    "evolved" TEXT NOT NULL,
    "disappeared" TEXT NOT NULL,
    "techlevel" TEXT NOT NULL,
    "capital" TEXT NOT NULL,
    "military" TEXT NOT NULL,
    "avgheight" INTEGER NOT NULL,
    "avgweight" INTEGER NOT NULL,
    "avglifespan" INTEGER NOT NULL,
    "planetId" INTEGER NOT NULL,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_governmentToplanet" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_governmentToplanet_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "species_slug_key" ON "species"("slug");

-- CreateIndex
CREATE INDEX "_governmentToplanet_B_index" ON "_governmentToplanet"("B");

-- AddForeignKey
ALTER TABLE "system" ADD CONSTRAINT "system_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "government" ADD CONSTRAINT "government_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "species" ADD CONSTRAINT "species_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "planet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_governmentToplanet" ADD CONSTRAINT "_governmentToplanet_A_fkey" FOREIGN KEY ("A") REFERENCES "government"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_governmentToplanet" ADD CONSTRAINT "_governmentToplanet_B_fkey" FOREIGN KEY ("B") REFERENCES "planet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
