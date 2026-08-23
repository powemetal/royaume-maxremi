/*
  Warnings:

  - You are about to drop the column `aligmnement` on the `Monstre` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Monstre" DROP COLUMN "aligmnement",
ADD COLUMN     "alignement" "Alignement";
