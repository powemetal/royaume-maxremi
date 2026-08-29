-- DropForeignKey
ALTER TABLE "Inventaire" DROP CONSTRAINT "Inventaire_idObjet_fkey";

-- AddForeignKey
ALTER TABLE "Inventaire" ADD CONSTRAINT "Inventaire_idObjet_fkey" FOREIGN KEY ("idObjet") REFERENCES "Objet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
