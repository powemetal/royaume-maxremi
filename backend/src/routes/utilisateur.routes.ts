import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middlewares/auth.js";
import { validate as estUuidValide } from "uuid";

const routerUtilisateur = Router();

// Création d'un utilisateur
routerUtilisateur.post(
  "/creer",
  authentifier,
  async (req: Request, res: Response) => {
    const { email, pseudo, mdp } = req.body;
    if (!email || !pseudo || !mdp) {
      return res.status(400).json({
        erreur: "Une information requise est manquante! (email, pseudo, mdp)",
      });
    }
    try {
      const utilisateur = await prisma.utilisateur.create({
        data: { email, pseudo, mdp },
      });
      return res.status(201).json({
        message: `Utilisateur créé avec succès ! Email : ${email}, pseudo : ${pseudo}`,
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Erreur lors de la création de l'utilisateur" });
    }
  },
);

// Récupérer l'information d'un utilisateur
routerUtilisateur.get(
  "recuperer/:id",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!estUuidValide(id)) {
      return res.status(400).json({ message: "Erreur : UUID invalide" });
    }
    try {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id },
      });
      return res.status(200).json({
        message: `Utilisateur trouvé`,
        data: { utilisateur },
      });
    } catch (error) {
      return res.status(404).json({
        message: `Erreur : Aucun utilisateur ne correspond à l'UUID ${id}`,
      });
    }
  },
);

// Mettre à jour un utilisateur
routerUtilisateur.patch(
  "modifier/:id",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!estUuidValide(id)) {
      return res.status(400).json({ message: "Erreur : UUID invalide" });
    }

    try {
      const utilisateur = await prisma.utilisateur.update({
        where: { id },
        data: req.body,
      });
      return res.status(200).json({
        message: `Utilisateur mis à jour`,
        data: utilisateur,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Erreur : Requête mal formée ou utilisateur non trouvé",
      });
    }
  },
);

// Mettre à jour un utilisateur
routerUtilisateur.delete(
  "supprimer/:id",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!estUuidValide(id)) {
      return res.status(400).json({ message: "Erreur : UUID invalide" });
    }

    try {
      const utilisateur = await prisma.utilisateur.delete({
        where: { id },
      });
      return res.status(200).json({
        message: `Utilisateur supprimé`,
        data: utilisateur,
      });
    } catch (error) {
      return res.status(404).json({
        message: `Erreur : Aucun utilisateur ne correspond à l'UUID ${id}`,
      });
    }
  },
);

export default routerUtilisateur;
