-- AlterTable
ALTER TABLE "Personnage" ADD COLUMN     "avatarUrl" TEXT NOT NULL DEFAULT 'https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png';

-- AlterTable
ALTER TABLE "Utilisateur" ADD COLUMN     "avatarUrl" TEXT NOT NULL DEFAULT 'https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png';
