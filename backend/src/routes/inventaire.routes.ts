import { Router, type Request, type Response } from "express"
import prisma from "../utils/prisma.js"

const routerInventaire = Router();


// Recuperer l'ID du'un personnage
routerInventaire.get('/inventaire/:personnageId', async (req: Request, res: Response) => {
  const personnageId = req.params;

  try {
    const inventaire = await prisma.inventaire.findUnique({
      where: { personnageId: personnageId },
      include: {
        objets: true // Inclut les détails de chaque objets dans l'inventaire
      }
    });

    if (!inventaire) {
      return res.status(404).json({ message: "Inventaire non trouvé pour ce personnage." });
    }

    res.json(inventaire);
  } catch (error) {
    res.status(500).json({ error: "Erreur de serveur lors de la récupération de l'inventaire : ${e}" });
  }
});

//Ajouter un objet a l'inventaire
routerInventaire.post("/inventaire/ajouter", async (req: Request, res: Response) => {
    const { personnageId, nomObjet } = req.body

    if (!personnageId || !nomObjet) {
        return res.status(400).json({ erreur: "L'ID du personnage et le nom de l'objet sont requis." })
    }

     try {
        // Trouve l'objet par son nom unique dans la table global des objets
        const objet = await prisma.objet.findFirst({
            where: { nom: { equals: nomObjet, mode: "insensitive" } }
        })

        if (!objet) {
            return res.status(404).json({ erreur: `L'objet ${nomObjet} n'existe pas dans le jeu.` })
        }

        // Connecte directement l'objet à l'inventaire via la relation 1-1 du personnage
        const inventaireMisAJour = await prisma.inventaire.update({
            where: { personnageId: personnageId },
            data: {
                objets: {
                    connect: { id: objet.id } // Connecte l'id numérique de l'objet trouvé
                }
            },
            include: { objets: true }
        })

        return res.status(200).json({ 
            message: `${objet.nom} a été ajouté avec succès.`,
            inventaire: inventaireMisAJour 
        })
    } catch (e) {
        return res.status(500).json({ erreur: `Erreur lors de l'ajout de l'objet : ${e}. Vérifiez que l'ID du personnage est correct.` })
    }
})

// Retirer objet de l'inventaire
routerInventaire.post('/:inventaireId/retirer', async (req: Request, res: Response) => {
const { personnageId, nomObjet } = req.body

    if (!personnageId || !nomObjet) {
        return res.status(400).json({ erreur: "L'ID du personnage et le nom de l'objet sont requis." })
    }

    try {
        // Trouve l'objet par son nom unique
        const objet = await prisma.objet.findFirst({
            where: { nom: { equals: nomObjet, mode: "insensitive" } }
        })

        if (!objet) {
            return res.status(404).json({ erreur: `L'objet ${nomObjet} n'existe pas.` })
        }

        // Déconnecte l'objet de la table relationnelle
        const inventaireMisAJour = await prisma.inventaire.update({
            where: { personnageId: personnageId },
            data: {
                objets: {
                    disconnect: { id: objet.id }
                }
            },
            include: { objets: true }
        })

        return res.status(200).json({ 
            message: `${objet.nom} a été retiré de l'inventaire.`,
            inventaire: inventaireMisAJour 
        })
    } catch (e) {
        return res.status(500).json({ erreur: `Erreur lors du retrait de l'objet : ${e}. Vérifiez que l'ID du personnage est correct.` })
    }
})

export default routerInventaire;
