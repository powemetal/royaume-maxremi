import { Router , type Request , type Response } from "express"
import prisma from "../utils/prisma.js"

const routeurQuetes = Router ()

routeurQuetes.post("/quete/creer", async (req: Request, res: Response) => {
    
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


//Modifier un quete
routeurQuetes.patch("/quete/:nom", async(req: Request, res: Response)=>{
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
            where: { id:quete.id},
            data: req.body
        })

        res.json(queteModifie)


    } catch(e){
        res.status(500).json({erreur: `Erreur serveur lors de la modification du quete : ${e}`})
    }
})


//Supprimer quete de la table des quetes
routeurQuetes.delete("/quete/supprimer/:nom", async (req: Request, res: Response) => {
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


//Liste des quetes dans la table
routeurQuetes.get("/quete/", async(req: Request, res: Response)=>{
    const quetes = await prisma.quete.findMany({
        orderBy : { id : "asc" }
    });
    res.json(quetes)
})

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