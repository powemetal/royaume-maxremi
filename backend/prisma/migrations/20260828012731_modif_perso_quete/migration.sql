-- DropForeignKey
ALTER TABLE "PersoQuete" DROP CONSTRAINT "PersoQuete_idQuete_fkey";

-- AddForeignKey
ALTER TABLE "PersoQuete" ADD CONSTRAINT "PersoQuete_idQuete_fkey" FOREIGN KEY ("idQuete") REFERENCES "Quete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
