import { Router , type Request , type Response } from "express"
import prisma from "../utils/prisma.js"
import { Statut, Difficulte } from "../../generated/prisma/client.js"
import { authentifier, exigerRole } from "../middlewares/auth.js"





const routeurQuetes = Router ()

routeurQuetes.post("/quete/creer", authentifier, exigerRole("MAITRE_DU_JEU"), async (req: Request, res: Response) => {
    
    const difficulteValides = ["FACILE", "MOYEN", "DIFFICILE", "LEGENDAIRE"]
    const { nom, difficulte, recompense } = req.body

    if (!nom) {
        return res.status(400).json({ erreur: "Le nom de l'quete est manquant" });
    }
    if (!difficulteValides.includes(difficulte)) {
        return res.status(400).json({erreur: `Difficulté invalide`})
    }

    try {
        const quete = await prisma.quete.create({ data: { nom, difficulte, recompense } })
        return res.status(201).json({ message: `Quete ${nom} créé avec succès !` })
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création de l'quete" })
    }
})

//Modifier une quete
routeurQuetes.patch("/quete/:nom", authentifier, exigerRole("MAITRE_DU_JEU"), async(req: Request, res: Response)=>{
    const nom = req.params.nom as string
        //Trouver l'quete
    try{
        const quete = await prisma.quete.findFirst({
            where : {
                nom: {
                    equals: nom,
                    mode: "insensitive",    
                }
            }, 
        })
        if (!quete){
            return res.status(404).json({erreur: `${nom} n'existe pas dans la table des quetes`})
        }

        //Modifie l'quete
        const queteModifie = await prisma.quete.update({
            where: { id : quete.id },
            data: req.body
        })

        res.json(queteModifie)

    } catch(e){
        res.status(500).json({erreur: `Erreur serveur lors de la modification du quete : ${e}`})
    }
})

//Supprimer quete de la table des quetes
routeurQuetes.delete("/quete/supprimer/:nom", authentifier, exigerRole("MAITRE_DU_JEU"), async (req: Request, res: Response) => {
    const suppression = await prisma.quete.deleteMany({
        where: {
            nom: {
                equals: req.params.nom as string,
                mode: "insensitive",
            },
        },
    });
    if (suppression.count === 0) {
        res.status(404).json({ erreur: "ce quete n'est pas dans la table des quetes" })
    } else {
        res.status(200).json({ok: "Quete supprimée"})
    }
});

//une seule route pour lister toutes les quetes ou filtrer par difficulte
routeurQuetes.get("/quete", async(req: Request, res: Response) => {     
    const { difficulte, statut } = req.query 
    const filtre : any = {}
    const difficulteValides = ["FACILE", "MOYEN", "DIFFICILE", "LEGENDAIRE"]
    const statutValides = ["DISPONIBLE", "EN_COURS", "TERMINE", "ECHOUE"]
    try {

        if (difficulte) {
            const difMaj = (difficulte as string).toUpperCase()
            if (!difficulteValides.includes(difMaj)) return res.status(400).json({erreur: "Difficulté invalide"})
            const quete = await prisma.quete.findMany({
                where : { difficulte: Difficulte[difMaj as keyof typeof Difficulte]},
                orderBy : { id : "asc" }
            })
            if (quete.length ===0) {
                return res.status(404).json({erreur: `Aucune quête la difficulte: ${difMaj}`})
            }
            return res.json(quete)
        }

        if (statut) {
            const statutMaj = (statut as string).toUpperCase()
            if (!statutValides.includes(statutMaj)) return res.status(400).json({erreur: "Statut invalide"})
            const persoQuete = await prisma.persoQuete.findMany({
                where : { statut : Statut[statutMaj as keyof typeof Statut]},
                include: { quete: true },
                orderBy : { id : "asc" }
            })
            if (persoQuete.length ===0) {
                return res.status(404).json({erreur: `Aucune quête avec le statut: ${statutMaj}`})
            }
            return res.json(persoQuete)
        }

        const toutesLesQuetes = await prisma.quete.findMany({
            orderBy: {id:"asc"}
        })
        if (toutesLesQuetes.length === 0) return res.status(404).json({erreur: "Aucune quête dans la table"})
        return res.json(toutesLesQuetes)

    } catch (e) {
        return res.status(500).json({erreur: `Erreur serveur : ${e}`})
    }
});

//recuprer 1 quete dans la table
routeurQuetes.get("/quete/:nom", async(req: Request, res: Response)=>{
    const nom = req.params.nom as string
    try {
        const quete = await prisma.quete.findFirst({
                where : {
                    nom: {
                        equals: nom,
                        mode: "insensitive",    
                    }
                }
        });

        if (!quete) {
            return res.status(404).json({erreur: `Quete introuvable dans la table`})
        }
        res.json(quete)
    } catch (e) {
        res.status(500).json({erreur: `Erreur serveur : ${e}`})
    }

})



export default routeurQuetes