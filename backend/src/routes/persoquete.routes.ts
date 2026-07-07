import { Router, type Request, type Response } from "express"
import prisma from "../utils/prisma.js"

const routerPersoQuete = Router();

// Recuperer un ID de personnage et son journal de quetes
routerPersoQuete.get("/persoquete/:personnageId", async (req: Request, res: Response) => {
  const idPerso = req.params;

  try {
     const journalQuetes = await prisma.persoQuete.findFirst({
            where: { idPersonnage: idPerso }, 
            include: {
                quete: true // inclu toutes les quetes de persoquete pour ce personnage
      }
    });

    return res.json(journalQuetes)
    } catch (e) {
        return res.status(500).json({ erreur: `Erreur serveur lors de la récupération du journal de quêtes : ${e}` })
    }
});


// ajouter une quete a un personnage
routerPersoQuete.post("/persoquete/ajouter", async (req: Request, res:Response) => {
    const { idPerso, idQuete } = req.body

    if (!idPerso || !idQuete) {
        return res.status(400).json({ erreur: "L'ID du personnage et l'ID de la quête sont requis." })
    }

    try {
        const queteAAjouter = await prisma.quete.findFirst({
            where: { id: idQuete },
        })

        if (!queteAAjouter) {
            return res.status(404).json({erreur: `La quête ${idQuete} n'existe pas dans le jeu.`})
        }

        const nouveauJournal = await prisma.persoQuete.create({
            data: {
                idPersonnage: idPerso,
                idQuete: queteAAjouter.id
            },
            include: {
                quete: true
            }
        })

        return res.status(201).json({
            message: `La quête ${queteAAjouter.nom} a été ajoutée au journal de quêtes du personnage.`,
            item: nouveauJournal
        })
    } catch (e) {
        return res.status(500).json({erreur: `Erreur lors de l'ajout de la quête au journal: ${e}`})

    }
});


