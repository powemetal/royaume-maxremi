import { Router , type Request , type Response } from "express"
import prisma from "../utils/prisma.js"
import { Statut, Difficulte } from "../../generated/prisma/client.js"
import { authentifier, exigerRole } from "../middlewares/auth.js"





const routeurQuetes = Router ()

routeurQuetes.post("/quete/creer", authentifier, exigerRole("MAITRE_DU_JEU"), async (req: Request, res: Response) => {
    
    const difficulteValides = ["FACILE", "MOYEN", "DIFFICILE", "LEGENDAIRE"]
    const { nom, difficulte, recompense, description } = req.body

    if (!nom) {
        return res.status(400).json({ erreur: "Erreur: Le nom de la quête est manquant." });
    }
    if (!difficulteValides.includes(difficulte)) {
        return res.status(400).json({erreur: `Erreur: Le niveau de difficulté est invalide.`})
    }
    if (recompense < 0) {
        return res.status(400).json({erreur: `Erreur: La récompense est invalide.`})
    }
    if (recompense === undefined || recompense === null) { // 0 est falsy mais permis dans notre scénario, on doit absolument vérifier si recompense est non definie ou nulle
        return res.status(400).json({erreur: `Erreur: Il doit y avoir une récompense valide.`})
    }

    try {
        const quete = await prisma.quete.create({ data: { nom, difficulte, recompense, description } })
        return res.status(201).json({ message: `La quête ${nom} a été créée avec succès!`, id: quete.id })
    } catch (error) {
        res.status(400).json({ erreur: "Erreur: La création de la quête a échouée." })
    }
})

// //Modifier une quete avec le nom ( Math : j'ai changé la route pour utiliser l'ID lors de la sélection d'une quête dans la liste dans la section admin )
// routeurQuetes.patch("/quete/:nom", authentifier, exigerRole("MAITRE_DU_JEU"), async(req: Request, res: Response)=>{
//     const nom = req.params.nom as string
//         //Trouver l'quete
//     try{
//         const quete = await prisma.quete.findFirst({
//             where : {
//                 nom: {
//                     equals: nom,
//                     mode: "insensitive",    
//                 }
//             }, 
//         })
//         if (!quete){
//             return res.status(404).json({erreur: `Erreur: La quête ${nom} n'existe pas dans le jeu.`})
//         }

//         //Modifie la quête
//         const queteModifie = await prisma.quete.update({
//             where: { id : quete.id },
//             data: req.body
//         })

//         res.status(200).json(queteModifie)

//     } catch(e){
//         res.status(500).json({erreur: `Erreur: Le serveur ne répond pas lors de la modification de la quête: ${e}`})
//     }
// })

//Modifier une quete avec l'id
routeurQuetes.patch("/quete/:id", authentifier, exigerRole("MAITRE_DU_JEU"), async(req: Request, res: Response)=>{
    const id = req.params.id as string
        //Trouver la quete
    try{
        const quete = await prisma.quete.findFirst({
            where : {
                id: {
                    equals: id,   
                }
            }, 
        })
        if (!quete){
            return res.status(404).json({erreur: `Erreur: La quête avec l'ID ${id} n'existe pas dans le jeu.`})
        }

        if (typeof req.body.recompense !== "number" || req.body.recompense < 0) {
            return res.status(400).json({erreur: "La récompense doit être un nombre positif."})
        }

        //Modifie la quête
        const queteModifie = await prisma.quete.update({
            where: { id : quete.id },
            data: req.body
        })

        res.status(200).json({quete: queteModifie, message: "La quête a été modifiée avec succès!" })

    } catch(e){
        res.status(500).json({erreur: `Erreur: Le serveur ne répond pas lors de la modification de la quête: ${e}`})
    }
})

//Supprimer quete de la table des quetes avec id
routeurQuetes.delete("/quete/supprimer/:id", authentifier, exigerRole("MAITRE_DU_JEU"), async (req: Request, res: Response) => {
    const id = req.params.id as string

    try {
        const queteExiste = await prisma.quete.findUnique({ where: {id} });

        if (!queteExiste) {
            return res.status(404).json({erreur: "Erreur: La quête n'a pas été retrouvé. Suppression impossible."})
        }

        await prisma.quete.delete({where: {id}});
        return res.status(200).json({message: "La quête a été supprimée avec succès."})
    } catch {
        return res.status(500).json({erreur: "Erreur du serveur"})
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
        res.status(404).json({ erreur: "Erreur: Cette quête n'est pas dans le jeu." })
    } else {
        res.status(200).json({ok: "La quête a été supprimée."})
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
                return res.status(404).json({erreur: `Erreur: Aucune quête avec le niveau de difficulté recherché: ${difMaj}.`})
            }
            return res.json(quete)
        }

        if (statut) {
            const statutMaj = (statut as string).toUpperCase()
            if (!statutValides.includes(statutMaj)) return res.status(400).json({erreur: "Erreur: Statut invalide."})
            const persoQuete = await prisma.persoQuete.findMany({
                where : { statut : Statut[statutMaj as keyof typeof Statut]},
                include: { quete: true },
                orderBy : { id : "asc" }
            })
            if (persoQuete.length ===0) {
                return res.status(404).json({erreur: `Erreur: Aucune quête avec le statut: ${statutMaj}.`})
            }
            return res.json(persoQuete)
        }

        const toutesLesQuetes = await prisma.quete.findMany({
            orderBy: {id:"asc"}
        })
        if (toutesLesQuetes.length === 0) return res.status(404).json({erreur: "Erreur: Il n'y a aucune quête dans le jeu."})
        return res.json(toutesLesQuetes)

    } catch (e) {
        return res.status(500).json({erreur: `Erreur: Le serveur ne répond pas lors de la récupération des quêtes: ${e}`})
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
            return res.status(404).json({erreur: `Erreur: Cette quête n'est pas dans le jeu.`})
        }
        res.json(quete)
    } catch (e) {
        res.status(500).json({erreur: `Erreur: Le serveur ne répond pas lors de la récupération de la quête: ${e}`})
    }

})



export default routeurQuetes