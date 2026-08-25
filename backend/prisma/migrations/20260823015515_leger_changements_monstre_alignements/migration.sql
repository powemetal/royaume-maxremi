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

-- CreateEnum
CREATE TYPE "TypeObjet" AS ENUM ('ARME', 'ARME_2_MAINS', 'MUNITION', 'BOUCLIER', 'ARMURE', 'BOTTES', 'CASQUE', 'GANT', 'CAPE', 'BIJOU', 'TRINKET', 'POTION', 'PARCHEMIN', 'BAGUETTE', 'BATON', 'FOCALISATEUR', 'OUTIL', 'SAC', 'CONTENEUR', 'MARCHANDISE', 'AUTRE');

-- CreateEnum
CREATE TYPE "TypeDegats" AS ENUM ('FEU', 'GLACE', 'ACIDE', 'POISON', 'TONNERRE', 'PSYCHIQUE', 'NECROTIQUE', 'FORCE', 'PERCANT', 'CONTONDANT', 'TRANCHANT', 'RADIANT');

-- CreateEnum
CREATE TYPE "TypeMonstre" AS ENUM ('ABERRATION', 'BETE', 'CELESTIEL', 'CONSTRUCTION', 'DRAGON', 'ELEMENTAIRE', 'FEERIQUE', 'FIELON', 'GEANT', 'HUMANOIDE', 'MONSTRUOSITE', 'VASE', 'PLANTE', 'MORT_VIVANT');

-- CreateEnum
CREATE TYPE "TypeGrosseur" AS ENUM ('TRES_PETIT', 'PETIT', 'MOYEN', 'GRAND', 'TRES_GRAND', 'GIGANTESQUE');

-- CreateEnum
CREATE TYPE "Alignement" AS ENUM ('NEUTRE', 'CHAOTIQUE_NEUTRE', 'LOYAL_NEUTRE', 'BON', 'LOYAL_BON', 'CHAOTIC_BON', 'MAUVAIS', 'CHAOTIQUE_MAUVAIS', 'LOYAL_MAUVAIS', 'SANS_ALIGNEMENT');

-- CreateTable
CREATE TABLE "Monstre" (
    "id" UUID NOT NULL,
    "nom" TEXT NOT NULL,
    "pointsDeVie" INTEGER NOT NULL DEFAULT 100,
    "attaque" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "typeMonstre" "TypeMonstre",
    "grandeur" "TypeGrosseur",
    "aligmnement" "Alignement",

    CONSTRAINT "Monstre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objet" (
    "id" UUID NOT NULL,
    "nom" TEXT NOT NULL,
    "rarete" "Rarete" NOT NULL,
    "type" "TypeObjet" NOT NULL,
    "att" INTEGER,
    "def" INTEGER,
    "prix" INTEGER NOT NULL,
    "typeDegats" "TypeDegats",
    "degatsBonus" INTEGER,
    "typeBonus" "TypeDegats",
    "description" TEXT,

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
    "pointsDeVie" INTEGER NOT NULL DEFAULT 100,
    "idUtilisateur" UUID NOT NULL,

    CONSTRAINT "Personnage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quete" (
    "id" UUID NOT NULL,
    "nom" TEXT NOT NULL,
    "difficulte" "Difficulte" NOT NULL,
    "description" TEXT,
    "recompense" INTEGER NOT NULL,

    CONSTRAINT "Quete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersoQuete" (
    "id" UUID NOT NULL,
    "idQuete" UUID NOT NULL,
    "statut" "Statut" NOT NULL DEFAULT 'DISPONIBLE',
    "idPersonnage" UUID NOT NULL,

    CONSTRAINT "PersoQuete_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "PersoQuete_idPersonnage_idQuete_key" ON "PersoQuete"("idPersonnage", "idQuete");

-- CreateIndex
CREATE UNIQUE INDEX "Inventaire_idPersonnage_idObjet_key" ON "Inventaire"("idPersonnage", "idObjet");

-- AddForeignKey
ALTER TABLE "Personnage" ADD CONSTRAINT "Personnage_idUtilisateur_fkey" FOREIGN KEY ("idUtilisateur") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersoQuete" ADD CONSTRAINT "PersoQuete_idQuete_fkey" FOREIGN KEY ("idQuete") REFERENCES "Quete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersoQuete" ADD CONSTRAINT "PersoQuete_idPersonnage_fkey" FOREIGN KEY ("idPersonnage") REFERENCES "Personnage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventaire" ADD CONSTRAINT "Inventaire_idObjet_fkey" FOREIGN KEY ("idObjet") REFERENCES "Objet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventaire" ADD CONSTRAINT "Inventaire_idPersonnage_fkey" FOREIGN KEY ("idPersonnage") REFERENCES "Personnage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
