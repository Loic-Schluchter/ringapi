-- AlterTable
ALTER TABLE "system" ADD COLUMN     "colonized" TEXT,
ADD COLUMN     "governmentId" INTEGER,
ADD COLUMN     "species" TEXT,
ADD COLUMN     "stars" INTEGER;

-- CreateTable
CREATE TABLE "government" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "executiveBranch" TEXT NOT NULL,
    "legislativeBranch" TEXT NOT NULL,
    "militaryBranch" TEXT NOT NULL,

    CONSTRAINT "government_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "government_slug_key" ON "government"("slug");

-- AddForeignKey
ALTER TABLE "system" ADD CONSTRAINT "system_governmentId_fkey" FOREIGN KEY ("governmentId") REFERENCES "government"("id") ON DELETE SET NULL ON UPDATE CASCADE;
