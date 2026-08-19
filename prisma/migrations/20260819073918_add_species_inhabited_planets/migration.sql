-- CreateTable
CREATE TABLE "_Inhabitants" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Inhabitants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Inhabitants_B_index" ON "_Inhabitants"("B");

-- AddForeignKey
ALTER TABLE "_Inhabitants" ADD CONSTRAINT "_Inhabitants_A_fkey" FOREIGN KEY ("A") REFERENCES "planet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Inhabitants" ADD CONSTRAINT "_Inhabitants_B_fkey" FOREIGN KEY ("B") REFERENCES "species"("id") ON DELETE CASCADE ON UPDATE CASCADE;
