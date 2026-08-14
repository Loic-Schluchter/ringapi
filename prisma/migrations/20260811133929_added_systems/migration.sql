-- AlterTable
ALTER TABLE "planet" ADD COLUMN     "systemId" INTEGER;

-- CreateTable
CREATE TABLE "system" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "system_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_name_key" ON "system"("name");

-- AddForeignKey
ALTER TABLE "planet" ADD CONSTRAINT "planet_systemId_fkey" FOREIGN KEY ("systemId") REFERENCES "system"("id") ON DELETE SET NULL ON UPDATE CASCADE;
