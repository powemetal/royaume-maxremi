// migrate + generate
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
    const inventaireMisAJour = await prisma.inventaire.update({
      where: { id: parseInt(inventaireId) },
      data: {
        objets: {
          connect: { id: parseInt(objetId) } // Connecte l'objet existant à l'inventaire
        }
      },
      include: { objets: true }
    });

    res.json({ message: "Objet ajouté avec succès", inventaire: inventaireMisAJour });
  } catch (error) {
    res.status(500).json({ error: "Impossible d'ajouter l'objet à l'inventaire." });
  }
});

// Retirer objet de l'inventaire
routerInventaire.post('/:inventaireId/retirer', async (req: Request, res: Response) => {
  const { inventaireId } = req.params;
  const { objetId } = req.body;

  try {
    const inventaireMisAJour = await prisma.inventaire.update({
      where: { id: parseInt(inventaireId) },
      data: {
        objets: {
          disconnect: { id: parseInt(objetId) } // Déconnecte l'objet sans le supprimer de la BD
        }
      },
      include: { objets: true }
    });

    res.json({ message: "Objet retiré avec succès", inventaire: inventaireMisAJour });
  } catch (error) {
    res.status(500).json({ error: "Impossible de retirer l'objet de l'inventaire." });
  }
});

export default router;
