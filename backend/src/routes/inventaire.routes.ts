import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { validate as estUuidValide } from "uuid";

const routerInventaire = Router();

// Récuperer l'inventaire d'un personnage
routerInventaire.get("/:idPersonnage", async (req: Request, res: Response) => {
  const idPersonnage = req.params.personnageId as string;

  if (!estUuidValide(idPersonnage)) {
    return res.status(400).json({ message: "Erreur : UUID invalide" });
  }

  try {
    const inventaire = await prisma.inventaire.findMany({
      where: { idPersonnage: idPersonnage },
      include: {
        objet: true, // Inclut les détails de chaque objets dans l'inventaire
      },
    });

    return res.status(200).json(`Inventaire : ${inventaire}`);
  } catch (e) {
    return res.status(500).json({
      erreur: `Erreur serveur lors de la récupération de l'inventaire : ${e}`,
    });
  }
});

//Ajouter un objet a l'inventaire
routerInventaire.post("/ajouter", async (req: Request, res: Response) => {
  const { personnageId, nomObjet } = req.body;

  if (!personnageId || !nomObjet) {
    return res.status(400).json({
      erreur: "L'ID du personnage et le nom de l'objet sont requis.",
    });
  }

  try {
    // Trouve l'objet par son nom unique dans la table global des objets
    const objet = await prisma.objet.findUnique({
      where: { nom: nomObjet },
    });

    if (!objet) {
      return res
        .status(404)
        .json({ erreur: `L'objet ${nomObjet} n'existe pas dans le jeu.` });
    }

    // Connecte directement l'objet à l'inventaire via la relation 1-1 du personnage
    const nouvelItemInventaire = await prisma.inventaire.create({
      data: {
        idPersonnage: personnageId,
        idObjet: objet.id,
      },
      include: {
        objet: true,
      },
    });

    return res.status(201).json({
      message: `L'objet '${objet.nom}' a été ajouté à l'inventaire du personnage.`,
      item: nouvelItemInventaire,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ erreur: `Erreur lors de l'ajout de l'objet : ${e}.` });
  }
});

// Retirer objet de l'inventaire
routerInventaire.delete("/retirer", async (req: Request, res: Response) => {
  const { personnageId, nomObjet } = req.body;

  if (!personnageId || !nomObjet) {
    return res
      .status(400)
      .json({ erreur: "L'ID du personnage et le nom de l'objet sont requis." });
  }

  try {
    // Trouver l'objet global pour avoir son ID
    const objet = await prisma.objet.findUnique({
      where: { nom: nomObjet },
    });

    if (!objet) {
      return res
        .status(404)
        .json({ erreur: `L'objet '${nomObjet}' n'existe pas.` });
    }

    // Trouver la ligne dans l'inventaire du personnage qui lient cet objet
    const itemInventaire = await prisma.inventaire.findFirst({
      where: {
        idPersonnage: personnageId,
        idObjet: objet.id,
      },
    });

    if (!itemInventaire) {
      return res.status(404).json({
        erreur: `Le personnage ne possède pas cet objet dans son inventaire.`,
      });
    }

    // Supprimer cette l'objet de l'inventaire
    await prisma.inventaire.delete({
      where: { id: itemInventaire.id },
    });

    return res.status(200).json({
      message: `L'objet '${objet.nom}' a été retiré de l'inventaire.`,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ erreur: `Erreur lors du retrait de l'objet : ${e}.` });
  }
});

export default routerInventaire;
