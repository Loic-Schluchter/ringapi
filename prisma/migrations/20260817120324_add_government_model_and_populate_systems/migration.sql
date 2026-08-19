-- DropForeignKey
ALTER TABLE "system" DROP CONSTRAINT "system_governmentId_fkey";

-- CreateTable
CREATE TABLE "_governmentTosystem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_governmentTosystem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_governmentTosystem_B_index" ON "_governmentTosystem"("B");

-- AddForeignKey
ALTER TABLE "_governmentTosystem" ADD CONSTRAINT "_governmentTosystem_A_fkey" FOREIGN KEY ("A") REFERENCES "government"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_governmentTosystem" ADD CONSTRAINT "_governmentTosystem_B_fkey" FOREIGN KEY ("B") REFERENCES "system"("id") ON DELETE CASCADE ON UPDATE CASCADE;
