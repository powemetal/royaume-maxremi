/*
  Warnings:

  - You are about to drop the column `Att` on the `Objet` table. All the data in the column will be lost.
  - You are about to drop the column `Def` on the `Objet` table. All the data in the column will be lost.
  - You are about to drop the column `DegatsBonus` on the `Objet` table. All the data in the column will be lost.
  - You are about to drop the column `Prix` on the `Objet` table. All the data in the column will be lost.
  - You are about to drop the column `Type` on the `Objet` table. All the data in the column will be lost.
  - You are about to drop the column `TypeBonus` on the `Objet` table. All the data in the column will be lost.
  - You are about to drop the column `TypeDegats` on the `Objet` table. All the data in the column will be lost.
  - Added the required column `prix` to the `Objet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tType` to the `Objet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `typeDegats` to the `Objet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TypeObjet" ADD VALUE 'MUNITION';
ALTER TYPE "TypeObjet" ADD VALUE 'GANT';
ALTER TYPE "TypeObjet" ADD VALUE 'CAPE';
ALTER TYPE "TypeObjet" ADD VALUE 'POTION';
ALTER TYPE "TypeObjet" ADD VALUE 'PARCHEMIN';
ALTER TYPE "TypeObjet" ADD VALUE 'BAGUETTE';
ALTER TYPE "TypeObjet" ADD VALUE 'BATON';
ALTER TYPE "TypeObjet" ADD VALUE 'FOCALISATEUR';
ALTER TYPE "TypeObjet" ADD VALUE 'OUTIL';
ALTER TYPE "TypeObjet" ADD VALUE 'SAC';
ALTER TYPE "TypeObjet" ADD VALUE 'CONTENEUR';
ALTER TYPE "TypeObjet" ADD VALUE 'MARCHANDISE';
ALTER TYPE "TypeObjet" ADD VALUE 'AUTRE';

-- AlterTable
ALTER TABLE "Objet" DROP COLUMN "Att",
DROP COLUMN "Def",
DROP COLUMN "DegatsBonus",
DROP COLUMN "Prix",
DROP COLUMN "Type",
DROP COLUMN "TypeBonus",
DROP COLUMN "TypeDegats",
ADD COLUMN     "att" INTEGER,
ADD COLUMN     "def" INTEGER,
ADD COLUMN     "degatsBonus" INTEGER,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "prix" INTEGER NOT NULL,
ADD COLUMN     "tType" "TypeObjet" NOT NULL,
ADD COLUMN     "typeBonus" "TypeDegats",
ADD COLUMN     "typeDegats" "TypeDegats" NOT NULL;
