import { Router, type Request, type Response } from "express"
import prisma from "../utils/prisma.js"
import { authentifier } from "../middlewares/auth.js";

const routerPersoQuete = Router();

// Recuperer un ID de personnage et son journal de quetes
routerPersoQuete.get("/:personnageId", authentifier, async (req: Request, res: Response) => {
  const idPerso = req.params.personnageId as string;

  try {
     const journalQuetes = await prisma.persoQuete.findMany({
            where: { idPersonnage: idPerso }, 
            include: {
                quete: true // inclu toutes les quetes de persoquete pour ce personnage
      }
    });

    return res.json(journalQuetes)
    } catch (e) {
        return res.status(500).json({ erreur: `Erreur: Le serveur ne répond pas lors de la récupération du journal de quêtes : ${e}` })
    }
});


// ajouter une quete a un personnage
routerPersoQuete.post("/ajouter", authentifier, async (req: Request, res:Response) => {
    const { idPerso, idQuete } = req.body

    if (!idPerso || !idQuete) {
        return res.status(400).json({ erreur: "Erreur: L'ID du personnage et l'ID de la quête sont requis." })
    }

    try {
        const queteAAjouter = await prisma.quete.findFirst({
            where: { id: idQuete },
        })

        if (!queteAAjouter) {
            return res.status(404).json({erreur: `Erreur: La quête ${idQuete} n'existe pas dans le jeu.`})
        }

        const nouveauJournal = await prisma.persoQuete.create({
            data: {
                idPersonnage: idPerso,
                idQuete: queteAAjouter.id,
                statut : "EN_COURS"
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
        return res.status(500).json({erreur: `Erreur: Le serveur ne répond pas lors de l'ajout de la quête au journal de quêtes: ${e}`})

    }
});


//Modifier un persoQuete
routerPersoQuete.patch("/persoquete/modifier/:id", authentifier, async(req: Request, res: Response)=>{
    const idPersoQuete = req.params.id as string
try {
    const persoQueteModifie = await prisma.persoQuete.update({
        where: { id: idPersoQuete },
        data: req.body
    })
    return res.json(persoQueteModifie)

    } catch (e) {
        return res.status(500).json({
            erreur: `Erreur: Le serveur ne répond pas lors de la modification du journal de quêtes: ${e}`
        })
    }
})

// reussir une quete
routerPersoQuete.patch("/journal/reussir/:id", authentifier, async(req: Request, res: Response)=>{
    const idPersoQuete = req.params.id as string
try {
    const persoQueteModifie = await prisma.persoQuete.update({
        where: { id: idPersoQuete },
        data: { statut: "TERMINE" },
        include: { quete: true }
    })

    const recompense = persoQueteModifie.quete.recompense

    const attribuerRecompense = await prisma.personnage.update({
        where: { id: persoQueteModifie.idPersonnage },
        data: { piecesDOr : { increment: recompense } }})
    return res.json({
        personnage: attribuerRecompense, 
        persoQuete: persoQueteModifie,
        Message: `Quête réussie! Récompense de ${recompense} reçue!`
    })

    } catch (e) {
        return res.status(500).json({
            erreur: `Erreur: Le serveur ne répond pas lors de la modification du journal de quêtes: ${e}`
        })
    }
})

// Echouer une quete
routerPersoQuete.patch("/journal/echouer/:id", authentifier, async(req: Request, res: Response)=>{
    const idPersoQuete = req.params.id as string
try {
    const persoQueteModifie = await prisma.persoQuete.update({
        where: { id: idPersoQuete },
        data: { statut: "ECHOUE" },
        include: { quete: true }
    })
    return res.status(200).json({
        persoQuete: persoQueteModifie, 
        Message: "Quête échouée!"
    })

    } catch (e) {
        return res.status(500).json({
            erreur: `Erreur: Le serveur ne répond pas lors de la modification du journal de quêtes: ${e}`
        })
    }
})

// Abandonner une quete
routerPersoQuete.delete("/journal/abandonner/:id", authentifier, async(req: Request, res: Response)=>{
    const idPersoQuete = req.params.id as string
    try {
        const abandon = await prisma.persoQuete.deleteMany({  // pour savoir si il y a un nombre de lignes eviter de faire 2 requetes pour verifier
            where: { id: idPersoQuete },
        })

        if (abandon.count === 0) {
            res.status(404).json({ erreur: "Erreur: Cette quête n'existe pas dans le journal de quêtes du personnage." })
        } else {
            return res.status(200).json({
            Message: "Quête abandonnée!"
            }) 
        }

        } catch (e) {
            return res.status(500).json({
                erreur: `Erreur: Le serveur ne répond pas lors de la modification du journal de quêtes: ${e}`
            })
        }
})






export default routerPersoQuete;


