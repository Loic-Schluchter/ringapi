/*
  Warnings:

  - You are about to drop the `Moon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Planet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Moon" DROP CONSTRAINT "Moon_planetId_fkey";

-- DropTable
DROP TABLE "Moon";

-- DropTable
DROP TABLE "Planet";

-- CreateTable
CREATE TABLE "planet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "planet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "planetId" INTEGER,

    CONSTRAINT "moon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "planet_name_key" ON "planet"("name");

-- CreateIndex
CREATE UNIQUE INDEX "moon_name_key" ON "moon"("name");

-- AddForeignKey
ALTER TABLE "moon" ADD CONSTRAINT "moon_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "planet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
