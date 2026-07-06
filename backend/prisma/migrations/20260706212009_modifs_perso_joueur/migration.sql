/*
  Warnings:

  - You are about to drop the column `statut` on the `Quete` table. All the data in the column will be lost.
  - You are about to drop the `JournalQuete` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[idPersonnage,idObjet]` on the table `Inventaire` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "JournalQuete" DROP CONSTRAINT "JournalQuete_idPersonnage_fkey";

-- DropForeignKey
ALTER TABLE "JournalQuete" DROP CONSTRAINT "JournalQuete_idQuete_fkey";

-- AlterTable
ALTER TABLE "Quete" DROP COLUMN "statut";

-- DropTable
DROP TABLE "JournalQuete";

-- CreateTable
CREATE TABLE "PersoQuete" (
    "id" UUID NOT NULL,
    "idQuete" UUID NOT NULL,
    "statut" "Statut" NOT NULL DEFAULT 'DISPONIBLE',
    "idPersonnage" UUID NOT NULL,

    CONSTRAINT "PersoQuete_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersoQuete_idPersonnage_idQuete_key" ON "PersoQuete"("idPersonnage", "idQuete");

-- CreateIndex
CREATE UNIQUE INDEX "Inventaire_idPersonnage_idObjet_key" ON "Inventaire"("idPersonnage", "idObjet");

-- AddForeignKey
ALTER TABLE "PersoQuete" ADD CONSTRAINT "PersoQuete_idQuete_fkey" FOREIGN KEY ("idQuete") REFERENCES "Quete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersoQuete" ADD CONSTRAINT "PersoQuete_idPersonnage_fkey" FOREIGN KEY ("idPersonnage") REFERENCES "Personnage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
