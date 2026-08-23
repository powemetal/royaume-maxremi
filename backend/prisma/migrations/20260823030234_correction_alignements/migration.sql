/*
  Warnings:

  - The values [BON,CHAOTIC_BON,MAUVAIS] on the enum `Alignement` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Alignement_new" AS ENUM ('NEUTRE', 'NEUTRE_BON', 'NEUTRE_MAUVAIS', 'CHAOTIQUE_NEUTRE', 'CHAOTIQUE_BON', 'CHAOTIQUE_MAUVAIS', 'LOYAL_NEUTRE', 'LOYAL_BON', 'LOYAL_MAUVAIS', 'SANS_ALIGNEMENT');
ALTER TABLE "Monstre" ALTER COLUMN "aligmnement" TYPE "Alignement_new" USING ("aligmnement"::text::"Alignement_new");
ALTER TYPE "Alignement" RENAME TO "Alignement_old";
ALTER TYPE "Alignement_new" RENAME TO "Alignement";
DROP TYPE "public"."Alignement_old";
COMMIT;
