-- CreateEnum
CREATE TYPE "Role" AS ENUM ('JOUEUR', 'MAITRE_DU_JEU');

-- CreateEnum
CREATE TYPE "Rarete" AS ENUM ('COMMUN', 'PEU_COMMUN', 'RARE', 'LEGENDAIRE');

-- CreateEnum
CREATE TYPE "Difficulte" AS ENUM ('FACILE', 'MOYEN', 'DIFFICILE', 'LEGENDAIRE');

-- CreateEnum
CREATE TYPE "Statut" AS ENUM ('DISPONIBLE', 'EN_COURS', 'TERMINE', 'ECHOUE');

-- CreateEnum
CREATE TYPE "Classe" AS ENUM ('GUERRIER', 'MAGE', 'VOLEUR', 'CLERC');

-- CreateTable
CREATE TABLE "Monstre" (
    "id" UUID NOT NULL,
    "nom" TEXT NOT NULL,
    "pointsDeVie" INTEGER NOT NULL,
    "attaque" INTEGER NOT NULL,

    CONSTRAINT "Monstre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objet" (
    "id" UUID NOT NULL,
    "nom" TEXT NOT NULL,
    "rarete" "Rarete" NOT NULL,

    CONSTRAINT "Objet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "pseudo" TEXT NOT NULL,
    "mdp" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'JOUEUR',

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personnage" (
    "id" UUID NOT NULL,
    "nom" TEXT NOT NULL,
    "classe" "Classe" NOT NULL,
    "niveau" INTEGER NOT NULL DEFAULT 1,
    "piecesDOr" INTEGER NOT NULL DEFAULT 0,
    "pointsDeVie" INTEGER NOT NULL,
    "idUtilisateur" UUID NOT NULL,

    CONSTRAINT "Personnage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quete" (
    "id" UUID NOT NULL,
    "nom" TEXT NOT NULL,
    "difficulte" "Difficulte" NOT NULL,
    "statut" "Statut" NOT NULL,
    "recompense" INTEGER NOT NULL,

    CONSTRAINT "Quete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalQuete" (
    "id" UUID NOT NULL,
    "idQuete" UUID NOT NULL,
    "idPersonnage" UUID NOT NULL,

    CONSTRAINT "JournalQuete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventaire" (
    "id" UUID NOT NULL,
    "idObjet" UUID NOT NULL,
    "idPersonnage" UUID NOT NULL,

    CONSTRAINT "Inventaire_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Monstre_nom_key" ON "Monstre"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Objet_nom_key" ON "Objet"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Personnage_nom_key" ON "Personnage"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Quete_nom_key" ON "Quete"("nom");

-- AddForeignKey
ALTER TABLE "Personnage" ADD CONSTRAINT "Personnage_idUtilisateur_fkey" FOREIGN KEY ("idUtilisateur") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalQuete" ADD CONSTRAINT "JournalQuete_idQuete_fkey" FOREIGN KEY ("idQuete") REFERENCES "Quete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalQuete" ADD CONSTRAINT "JournalQuete_idPersonnage_fkey" FOREIGN KEY ("idPersonnage") REFERENCES "Personnage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventaire" ADD CONSTRAINT "Inventaire_idObjet_fkey" FOREIGN KEY ("idObjet") REFERENCES "Objet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventaire" ADD CONSTRAINT "Inventaire_idPersonnage_fkey" FOREIGN KEY ("idPersonnage") REFERENCES "Personnage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
