import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middlewares/auth.js";
import { validate as estUuidValide } from "uuid";
import bcrypt from "bcryptjs";

const routerUtilisateur = Router();

// Création d'un utilisateur en tant que MDJ
routerUtilisateur.post(
  "/creer",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    const { email, pseudo, mdp } = req.body;
    if (!email || !pseudo || !mdp) {
      return res.status(400).json({
        erreur: "Erreur: Une information requise est manquante. (email, pseudo, mdp)",
      });
    }
    try {
      const hash = await bcrypt.hash(mdp, 10);
      const utilisateur = await prisma.utilisateur.create({
        data: { email, pseudo, mdp: hash },
      });
      return res.status(201).json({
        message: `Utilisateur créé avec succès ! Email : ${email}, pseudo : ${pseudo}`,
        id: utilisateur.id
      });
    } catch (error) {
      res
        .status(400)
        .json({ message: "Erreur: l'utilisateur n'a pas pu être créé." });
    }
  },
);

// Récupérer l'information d'un utilisateur en tant que MDJ
routerUtilisateur.get(
  "/recuperer/:id",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!estUuidValide(id)) {
      return res.status(400).json({ message: "Erreur: L'ID est invalide." });
    }
    try {
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id },
      });

      if (!utilisateur) {
        return res.status(404).json({
          message: `Erreur : Aucun utilisateur ne correspond à l'UUID ${id}`,
        });
      }

      return res.status(200).json({
        message: `Utilisateur trouvé.`,
        data: { utilisateur },
      });
    } catch (error) {
      return res.status(404).json({
        message: `Erreur: Aucun utilisateur ne correspond à l'ID ${id}`,
      });
    }
  },
);

// Mettre à jour un utilisateur en tant que MDJ
routerUtilisateur.patch(
  "/modifier/:id",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!estUuidValide(id)) {
      return res.status(400).json({ message: "Erreur: L'ID est invalide." });
    }

    const { email, pseudo, mdp } = req.body;

    const data: any = {};

    if (email) data.email = email;
    if (pseudo) data.pseudo = pseudo;
    if (mdp) data.mdp = await bcrypt.hash(mdp, 10);

    try {
      const utilisateur = await prisma.utilisateur.update({
        where: { id },
        data: data,
      });

      utilisateur.mdp = ""; //attribuer une nouvelle valeur a mdp sinon la reponse contiendra le mdp hashé

      return res.status(200).json({
        message: `L'utilisateur a été mis à jour.`,
        data: utilisateur,
      });
    } catch (error) {
      return res.status(400).json({
        message: "Erreur : Requête mal formée ou utilisateur non trouvé.",
      });
    }
  },
);

// Supprimer un utilisateur en tant que MDJ
routerUtilisateur.delete(
  "/supprimer/:id",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    if (!estUuidValide(id)) {
      return res.status(400).json({ message: "Erreur: L'ID est invalide." });
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
        message: `Erreur: Aucun utilisateur ne correspond à l'ID: ${id}`,
      });
    }
  },
);

export default routerUtilisateur;
