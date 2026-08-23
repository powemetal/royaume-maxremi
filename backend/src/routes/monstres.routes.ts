import { Router, type Request, type Response } from "express";
import { monstres } from "../api/monstres.js";
import axios from "axios";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middlewares/auth.js";
import { TypeGrosseur, Alignement, TypeMonstre } from "../../generated/prisma/enums.js";
const routeurMonstres = Router();

interface MonstreAPI {
  index: string;
  name?: string;
  url: string;
}

interface ListeMonstresAPI {
  count: number;
  results: MonstreAPI[]
}


const traductionTypeMonstre: Record<string, TypeMonstre> = {
    "aberration": "ABERRATION",
    "beast": "BETE",
    "celestial": "CELESTIEL",
    "construct": "CONSTRUCTION",
    "dragon": "DRAGON",
    "elemental": "ELEMENTAIRE",
    "fey": "FEERIQUE",
    "fiend": "FIELON",
    "giant": "GEANT",
    "humanoid": "HUMANOIDE",
    "monstrosity": "MONSTRUOSITE",
    "ooze": "VASE",
    "plant": "PLANTE",
    'undead': "MORT_VIVANT"
};


const traductionGrosseur: Record<string, TypeGrosseur> = {
    "Tiny": "TRES_PETIT",
    "Small": "PETIT",
    "Medium": "MOYEN",
    "Large": "GRAND",
    "Huge": "TRES_GRAND",
    "Gargantuan": "GIGANTESQUE"
};


const traductionAlignment: Record<string, Alignement> = {
    "neutral evil": "NEUTRE_MAUVAIS",
    "neutral good": "NEUTRE_BON",
    "neutral": "NEUTRE",
    "chaotic good": "CHAOTIQUE_BON",
    "chaotic evil": "CHAOTIQUE_MAUVAIS",
    "chaotic neutral": "CHAOTIQUE_NEUTRE",
    "lawful good": "LOYAL_BON",
    "lawful evil": "LOYAL_MAUVAIS",
    "lawful neutral": "LOYAL_NEUTRE",
    "unaligned": "SANS_ALIGNEMENT",
    "any alignment": "SANS_ALIGNEMENT",
    "typically chaotic evil": "CHAOTIQUE_NEUTRE",
    "any non-good alignment": "NEUTRE_MAUVAIS"
};

// recuperer un monstre dans l'api
async function recupererMonstre(nom: string) {
  try {
    const { data } = await monstres.get(`/${nom.toLowerCase()}`);
    const attack = data.strength > data.dexterity ? data.strength : data.dexterity;
    const alignementMonstre = traductionAlignment[data.alignment.toLowerCase()];
    const typeMonstre =  traductionTypeMonstre[data.type];
    const grosseurMonstre = traductionGrosseur[data.size];
    return {
      nom: data.name,
      pointsDeVie: data.hit_points,
      typeMonstre: typeMonstre,
      attaque: attack,
      defense: data.armor_class[0],
      alignement: alignementMonstre,
      grandeur: grosseurMonstre

    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      console.log("Statut HTTP : ", e.response);
    } else {
      console.log("Erreur réseau ou time-out");
    }
    return null;
  }
}

//Ajouter un monstre dans la table monstre
routeurMonstres.post(
  "/monstre/ajouter/:nom",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    const donnees = await recupererMonstre(req.params.nom as string);
    if (!donnees) {
        return res.status(404).json({erreur: "Ce monstre n'existe pas dans le manuel des monstres"})
    }
    try{
        const monstre = await prisma.monstre.create({
            data: donnees as any,
        })
        res.status(201).json({ message: `${monstre.nom} a été ajouté a dans la table: monstres de la base de données`})
    } catch (e) {
        res.status(400).json({erreur: "Ce monstre est deja dans la base de données"})
    }
  },
);

//chercher un monstre dans l'api et retourner les resultats
routeurMonstres.get("/recherche/:nom", async (req: Request, res: Response) => {
  const nom = req.params.nom;

  //pour s'assurer que le nom est bel et bien une string non vide
  if (typeof nom !== "string") return res.status(400).json({erreur: "Veuillez entrer un nom de monstre a rechercher"})

  const recherche = nom.toLowerCase();

  try{
    const { data } = await monstres.get<ListeMonstresAPI>("/")

    const resultats = data.results.filter(monstre =>
    (monstre.name ?? "").toLowerCase().includes(recherche)
    )

  res.json(resultats)
  } catch (e) {
    res.status(500).json({erreur:"Impossible de contacter l'API"})
  }

})



//Modifier un monstre
routeurMonstres.patch(
  "/monstre/:id",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    const nom = req.params.id as string;

    try {

    //validation des donnees
    


    } catch(e){
        res.status(500).json({erreur: `Erreur serveur lors de la modification du monstre : ${e}`})
    }
  },
);





//Supprimer monstre de la table des monstre
routeurMonstres.delete(
  "/monstre/supprimer/:id",
  authentifier,
  exigerRole("MAITRE_DU_JEU"),
  async (req: Request, res: Response) => {
    try{
      const suppression = await prisma.monstre.delete({
        where: { id: req.params.id as string,
        },
      });

      res.status(200).json({ok: "Monstre supprimé"})

    } catch (e: any) {
      if (e.code === "P2025") {
        return res.status(404).json({erreur: "Ce monstre n'est pas dans le jeu"});
      }

      res.status(500).json({erreur: "Erreur du serveur"})
    }
  },
);

//Liste des monstres dans la table
routeurMonstres.get("/monstre/", async (req: Request, res: Response) => {
  const monstres = await prisma.monstre.findMany({
    orderBy: { id: "asc" },
  });
  res.json(monstres);
});

//recuperer 1 monstre dans la table
routeurMonstres.get("/monstre/:nom", async (req: Request, res: Response) => {
  const nom = req.params.nom as string;
  try {
    const monstre = await prisma.monstre.findFirst({
      where: {
        nom: {
          equals: nom,
          mode: "insensitive",
        },
      },
    });

    if (!monstre) {
      return res
        .status(404)
        .json({ erreur: `Erreur: Le monstre ${nom} n'existe pas dans le jeu.` });
    }
    res.status(200).json(monstre);
  } catch (e) {
    res.status(500).json({ erreur: `Erreur: Le serveur ne répond pas lors de la récupération du monstre: ${e}` });
  }
});




export default routeurMonstres;
