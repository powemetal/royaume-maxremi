import { Router, type Request, type Response } from "express"
import prisma from "../utils/prisma.js"
import { authentifier } from "../middlewares/auth.js";

const routerPersoQuete = Router();

// Recuperer un ID de personnage et son journal de quetes
routerPersoQuete.get("/:personnageId", async (req: Request, res: Response) => {
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
        return res.status(500).json({ erreur: `Erreur serveur lors de la récupération du journal de quêtes : ${e}` })
    }
});


// ajouter une quete a un personnage
routerPersoQuete.post("/ajouter", async (req: Request, res:Response) => {
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
        return res.status(500).json({erreur: `Erreur lors de l'ajout de la quête au journal: ${e}`})

    }
});


//Modifier un persoQuete
routerPersoQuete.patch("/persoquete/modifier/:id", async(req: Request, res: Response)=>{
    const idPersoQuete = req.params.id as string
try {
    const persoQueteModifie = await prisma.persoQuete.update({
        where: { id: idPersoQuete },
        data: req.body
    })
    return res.json(persoQueteModifie)

    } catch (e) {
        return res.status(500).json({
            erreur: `Erreur serveur lors de la modification du persoQuete : ${e}`
        })
    }
})

// reussir une quete
routerPersoQuete.patch("/journal/reussir/:id", async(req: Request, res: Response)=>{
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
        Message: `Quête réussie! récompense de ${recompense} recue`
    })

    } catch (e) {
        return res.status(500).json({
            erreur: `Erreur serveur lors de la modification du journal persoQuete : ${e}`
        })
    }
})

// Echouer une quete
routerPersoQuete.patch("/journal/echouer/:id", async(req: Request, res: Response)=>{
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
            erreur: `Erreur serveur lors de la modification du journal persoQuete : ${e}`
        })
    }
})

// Abandonner une quete
routerPersoQuete.delete("/journal/abandonner/:id", async(req: Request, res: Response)=>{
    const idPersoQuete = req.params.id as string
    try {
        const abandon = await prisma.persoQuete.deleteMany({  // pour savoir si il y a un nombre de lignes eviter de faire 2 requetes pour verifier
            where: { id: idPersoQuete },
        })

        if (abandon.count === 0) {
            res.status(404).json({ erreur: "Cette quete n'existe pas dans le Journal du personnage" })
        } else {
            return res.status(200).json({
            Message: "Quête abandonnée!"
            }) 
        }

        } catch (e) {
            return res.status(500).json({
                erreur: `Erreur serveur lors de la modification du journal persoQuete : ${e}`
            })
        }
})






export default routerPersoQuete;


