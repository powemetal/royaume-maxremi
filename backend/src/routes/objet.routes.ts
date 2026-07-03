import { Router , type Request , type Response } from "express"
import prisma from "../utils/prisma.js"

const routeurObjets = Router ()

routeurObjets.post("/objet/creer", async (req: Request, res: Response) => {
    const raretesValides = ["COMMUN", "PEU_COMMUN", "RARE", "LEGENDAIRE"]
    const { nom, rarete } = req.body

    if (!nom) {
        return res.status(400).json({ erreur: "Le nom de l'objet est manquant" });
    }
    
    if (!raretesValides.includes(rarete)) {
        return res.status(400).json({erreur: `Rarete invalide`})
    }

    try {
        const objet = await prisma.objet.create({ data: { nom, rarete } })
        return res.status(201).json({ message: `Objet ${nom} créé avec succès !` })
    } catch (error) {
        res.status(400).json({ message: "Erreur lors de la création de l'objet" })
    }
})


//Modifier un objet
routeurObjets.patch("/objet/:nom", async(req: Request, res: Response)=>{
    const nom = req.params.nom as string
        //Trouver l'objet
    try{
        const objet = await prisma.objet.findFirst({
            where : {
                nom: {
                    equals: nom,
                    mode: "insensitive",    
                }
            }, 
        })
        if (!objet){
            return res.status(404).json({erreur: `${nom} n'existe pas dans la table des objets`})
        }

        //Modifie l'objet
        const objetModifie = await prisma.objet.update({
            where: { id:objet.id},
            data: req.body
        })

        res.json(objetModifie)


    } catch(e){
        res.status(500).json({erreur: `Erreur serveur lors de la modification du objet : ${e}`})
    }
})


//Supprimer objet de la table des objets
routeurObjets.delete("/objet/supprimer/:nom", async (req: Request, res: Response) => {
    const suppression = await prisma.objet.deleteMany({
        where: {
            nom: {
                equals: req.params.nom as string,
                mode: "insensitive",
            },
        },
    });
    if (suppression.count === 0) {
        res.status(404).json({ erreur: "ce objet n'est pas dans la table des objets" })
    } else {
        res.status(200).json({ok: "Objet supprimé"})
    }
});


//Liste des objets dans la table
routeurObjets.get("/objet/", async(req: Request, res: Response)=>{
    const objets = await prisma.objet.findMany({
        orderBy : { id : "asc" }
    });
    res.json(objets)
})

//recuprer 1 objet dans la table
routeurObjets.get("/objet/:nom", async(req: Request, res: Response)=>{
    const nom = req.params.nom as string
    try {
        const objet = await prisma.objet.findFirst({
                where : {
                    nom: {
                        equals: nom,
                        mode: "insensitive",    
                    }
                }
        });

        if (!objet) {
            return res.status(404).json({erreur: `Objet introuvable dans la table`})
        }
        res.json(objet)
    } catch (e) {
        res.status(500).json({erreur: `Erreur serveur : ${e}`})
    }

})



export default routeurObjets