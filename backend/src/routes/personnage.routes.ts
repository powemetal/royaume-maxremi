import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middlewares/auth.js";
import { validate as estUuidValide } from "uuid";

const routerPersonnage = Router();

// Création d'un personnage
routerPersonnage.post(
  "/creer",
  authentifier,
  async (req: Request, res: Response) => {
    const { nom, classe, idUtilisateur } = req.body;
    if (!nom || !classe || !idUtilisateur) {
      return res.status(400).json({
        erreur:
          "Erreur: Une information requise est manquante. (nom, classe, idUtilisateur)",
      });
    }
    try {
      const personnage = await prisma.personnage.create({
        data: { nom, classe, idUtilisateur },
      });
      return res.status(201).json({
        message: `Personnage créé avec succès ! Nom : ${nom}, classe : ${classe}, idUtilisateur : ${idUtilisateur}`,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Erreur: La création du personnage a échouée." });
    }
  },
);

// Récupérer l'information d'un personnage
routerPersonnage.get(
  "/recuperer/:id",
  authentifier,
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!estUuidValide(id)) {
      return res.status(400).json({ message: "Erreur : UUID invalide" });
    }
    try {
      const personnage = await prisma.personnage.findUnique({
        where: { id },
      });
      return res.status(200).json({
        message: `Personnage trouvé`,
        data: { personnage },
      });
    } catch (error) {
      return res.status(404).json({
        message: `Erreur : Aucun personnage ne correspond à cet ID: ${id}.`,
      });
    }
  },
);

// Mettre à jour un personnage
routerPersonnage.patch(
  "/modifier/:id",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!estUuidValide(id)) {
      return res.status(400).json({ message: "Erreur : L'ID est invalide." });
    }

    try {
      const personnage = await prisma.personnage.update({
        where: { id },
        data: req.body,
      });

      return res.status(200).json({
        message: `Personnage mis à jour`,
        data: personnage,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Erreur: Requête mal formée ou personnage inexistant dans le jeu.",
      });
    }
  },
);

// Supprimer un personnage
routerPersonnage.delete(
  "/supprimer/:id",
  authentifier,
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!estUuidValide(id)) {
      return res.status(400).json({ message: "Erreur : L'ID est invalide." });
    }

    try {
      const personnage = await prisma.personnage.delete({
        where: { id },
      });
      return res.status(200).json({
        message: `Personnage supprimé`,
        data: personnage,
      });
    } catch (error) {
      return res.status(404).json({
        message: `Erreur: Aucun personnage ne correspond à cet ID: ${id}.`,
      });
    }
  },
);

export default routerPersonnage;
