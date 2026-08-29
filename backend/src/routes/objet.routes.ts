import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middlewares/auth.js";

const routeurObjets = Router();
const raretesValides = ["COMMUN", "PEU_COMMUN", "RARE", "LEGENDAIRE"];
const typeValides = [
  "ARME",
  "ARME_2_MAINS",
  "MUNITION",
  "BOUCLIER",
  "ARMURE",
  "BOTTES",
  "CASQUE",
  "GANT",
  "CAPE",
  "BIJOU",
  "TRINKET",
  "POTION",
  "PARCHEMIN",
  "BAGUETTE",
  "BATON",
  "FOCALISATEUR",
  "OUTIL",
  "SAC",
  "CONTENEUR",
  "MARCHANDISE",
  "AUTRE",
];
const typeDegatsValides = [
  "FEU",
  "GLACE",
  "ACIDE",
  "POISON",
  "TONNERRE",
  "PSYCHIQUE",
  "NECROTIQUE",
  "FORCE",
  "PERCANT",
  "CONTONDANT",
  "TRANCHANT",
  "RADIANT",
];
import { Rarete, TypeDegats, TypeObjet } from "../../generated/prisma/enums.js";

interface ObjetInput {
  nom: string;
  rarete: Rarete;
  type: TypeObjet;
  att?: number | null;
  def?: number | null;
  prix: number;
  typeDegats?: TypeDegats | null;
  degatsBonus?: number | null;
  typeBonus?: TypeDegats | null;
  description?: string | null;
}

interface PatchObjet {
  nom?: string;
  rarete?: Rarete;
  type?: TypeObjet;
  att?: number | null;
  def?: number | null;
  prix?: number;
  typeDegats?: TypeDegats | null;
  degatsBonus?: number | null;
  typeBonus?: TypeDegats | null;
  description?: string | null;
}

routeurObjets.post(
  "/objet/creer",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    const { nom, rarete, type, prix } = req.body;

    if (!nom)
      return res
        .status(400)
        .json({ erreur: "Erreur: Le nom de l'objet est manquant" });
    if (!raretesValides.includes(rarete))
      return res
        .status(400)
        .json({ erreur: `Erreur: La rareté de l'objet est invalide` });
    if (!typeValides.includes(type))
      return res
        .status(400)
        .json({ erreur: `Erreur: Le type de l'objet est invalide` });
    if (typeof prix != "number")
      return res
        .status(400)
        .json({ erreur: `Erreur: Le prix doit être un nombre` });

    const data: ObjetInput = { nom, rarete, type, prix };

    if (
      req.body.att !== undefined &&
      ["ARME", "ARME_2_MAINS"].includes(req.body.type)
    ) {
      if (typeof req.body.att !== "number")
        return res.status(400).json({ erreur: "L'attaque est invalide" });
      data.att = req.body.att;
    }
    if (
      req.body.def !== undefined &&
      ["ARMURE", "BOTTES", "CASQUE", "BOUCLIER", "GANT"].includes(req.body.type)
    ) {
      if (typeof req.body.def !== "number")
        return res.status(400).json({ erreur: "La defense est invalide" });
      data.def = req.body.def;
    }
    if (req.body.typeDegats !== undefined) {
      if (!typeDegatsValides.includes(req.body.typeDegats)) {
        return res.status(400).json({ erreur: "Type de dégats invalide" });
      }
      data.typeDegats = req.body.typeDegats;
    }
    if (req.body.degatsBonus !== undefined) {
      if (typeof req.body.degatsBonus !== "number") {
        return res.status(400).json({ erreur: "Dégats bonus invalide" });
      }
      data.degatsBonus = req.body.degatsBonus;
    }
    if (req.body.typeBonus !== undefined) {
      if (!typeDegatsValides.includes(req.body.typeBonus)) {
        return res.status(400).json({ erreur: "Dégats bonus invalide" });
      }
      data.typeBonus = req.body.typeBonus;
    }
    if (req.body.description !== undefined) {
      if (typeof req.body.description !== "string")
        return res.status(400).json({ erreur: "Description invalide" });
      data.description = req.body.description;
    }

    try {
      const objet = await prisma.objet.create({
        data: data,
      });

      return res
        .status(201)
        .json({ message: `Objet ${data.nom} créé avec succès !` });
    } catch (error) {
      console.error("Erreur Prisma:", error);
      res.status(400).json({ erreur: "Erreur: L'objet n'a pas pu être créé." });
    }
  },
);

//Modifier un objet
routeurObjets.patch(
  "/objet/:id",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const nomObjet = req.params.nom as string;
    const body = req.body;

    //Trouver l'objet
    //pas la facon la plus utile, faire 2 requetes dans une route,
    //mais je lai fait ainsi pour simplifier le test.rest, je le laisse comme ca pour le moment
    try {
      const objet = await prisma.objet.findUnique({
        where: {id},
      });
      if (!objet)
        return res
          .status(404)
          .json({
            erreur: `Erreur: L'objet ${nomObjet} n'existe pas dans le jeu.`,
          });

      const data: PatchObjet = {};

      //validation des donnees
      if (body.nom !== undefined) data.nom = body.nom;
      if (body.rarete !== undefined) {
        if (!raretesValides.includes(body.rarete)) {
          return res.status(400).json({ erreur: "Rareté invalide" });
        }
        data.rarete = body.rarete;
      }
      if (body.type !== undefined) {
        if (!typeValides.includes(body.type)) {
          return res.status(400).json({ erreur: "Type d'objet invalide" });
        }
        data.type = body.type;
      }

      //*Merci Gemini*
      //Sert a prendre soit le nouveau type ou le type que lobjet avait deja sinon il sera possible de mettre une attaque a un objet de defence et vice versa
      const typeObjet = body.type || objet.type;
      if (
        body.att !== undefined &&
        ["ARME", "ARME_2_MAINS"].includes(typeObjet)
      ) {
        if (typeof body.att !== "number")
          return res.status(400).json({ erreur: "L'attaque est invalide" });
        data.att = body.att;
      }

      if (
        body.def !== undefined &&
        ["ARMURE", "BOTTES", "CASQUE", "BOUCLIER", "GANT"].includes(typeObjet)
      ) {
        if (typeof body.def !== "number")
          return res.status(400).json({ erreur: "La defense est invalide" });
        data.def = body.def;
      }
      if (body.prix !== undefined) {
        if (typeof body.prix !== "number")
          return res
            .status(400)
            .json({ erreur: "Le prix doit être un nombre" });
        data.prix = body.prix;
      }

      if (body.typeDegats !== undefined) {
        if (!typeDegatsValides.includes(body.typeDegats)) {
          return res.status(400).json({ erreur: "Type de dégats invalide" });
        }
        data.typeDegats = body.typeDegats;
      }

      if (body.degatsBonus !== undefined) {
        if (typeof body.degatsBonus !== "number")
          return res
            .status(400)
            .json({ erreur: "Type de dégats bonus invalide" });
        data.degatsBonus = body.degatsBonus;
      }
      if (body.typeBonus !== undefined) {
        if (!typeDegatsValides.includes(body.typeBonus)) {
          return res.status(400).json({ erreur: "Type de dégats invalide" });
        }
        data.typeBonus = body.typeBonus;
      }
      if (body.description !== undefined) {
        if (typeof body.description !== "string")
          return res.status(400).json({ erreur: "Description invalide" });
        data.description = body.description;
      }

      //Modifie l'objet
      const objetModifie = await prisma.objet.update({
        where: { id: objet.id },
        data: data,
      });
      res.status(200).json(objetModifie);
    } catch (e) {
      res
        .status(500)
        .json({
          erreur: `Erreur: Le serveur ne répond pas lors de la modification de l'objet : ${e}`,
        });
    }
  },
);

//Supprimer quete de la table des quetes avec id
routeurObjets.delete("/objet/supprimer/:id", authentifier, exigerRole("MAITRE_DU_JEU"), async (req: Request, res: Response) => {
    const id = req.params.id as string
    try {
        const objetExiste = await prisma.objet.findUnique({ where: {id} });

        if (!objetExiste) {
            return res.status(404).json({erreur: "Erreur: L'objet n'a pas été retrouvé. Suppression impossible."})
        }

        await prisma.objet.delete({where: {id}});
        return res.status(200).json({message: "L'objet a été supprimé avec succès."})
    } catch {
        return res.status(500).json({erreur: "Erreur du serveur"})
    }
})


// routeurObjets.delete(
//   "/objet/supprimer/:nom",
//   authentifier,
//   exigerRole("MAITRE_DU_JEU"),
//   async (req: Request, res: Response) => {
//     const suppression = await prisma.objet.deleteMany({
//       where: {
//         nom: {
//           equals: req.params.nom as string,
//           mode: "insensitive",
//         },
//       },
//     });
//     if (suppression.count === 0) {
//       res
//         .status(404)
//         .json({ erreur: "Erreur: Cet objet n'est pas dans le jeu." });
//     } else {
//       res.status(200).json({ ok: "L'objet a été supprimé." });
//     }
//   },
// );

//Liste des objets dans la table
routeurObjets.get("/objet/", async (req: Request, res: Response) => {
  const objets = await prisma.objet.findMany({
    orderBy: { id: "asc" },
  });
  res.json(objets);
});

//recuperer 1 objet dans la table
routeurObjets.get("/objet/:nom", async (req: Request, res: Response) => {
  const nom = req.params.nom as string;
  try {
    const objet = await prisma.objet.findFirst({
      where: {
        nom: {
          equals: nom,
          mode: "insensitive",
        },
      },
    });

    if (!objet) {
      return res
        .status(404)
        .json({ erreur: `Erreur: Cet objet n'est pas dans le jeu` });
    }
    res.json(objet);
  } catch (e) {
    res
      .status(500)
      .json({
        erreur: `Erreur: Le serveur ne répond pas lors de la récupération de l'objet: ${e}`,
      });
  }
});

export default routeurObjets;
