import { Router , type Request , type Response } from "express"
import prisma from "../utils/prisma.js"
import { authentifier, exigerRole } from "../middlewares/auth.js"

const routeurObjets = Router ()

routeurObjets.post("/objet/creer", authentifier, exigerRole("MAITRE_DU_JEU"), async (req: Request, res: Response) => {
    const raretesValides = ["COMMUN", "PEU_COMMUN", "RARE", "LEGENDAIRE"]
    const { nom, rarete } = req.body

    if (!nom) {
        return res.status(400).json({ erreur: "Erreur: Le nom de l'objet est manquant" });
    }
    
    if (!raretesValides.includes(rarete)) {
        return res.status(400).json({erreur: `Erreur: La rareté de l'objet est invalide`})
    }

    try {
        const objet = await prisma.objet.create({ data: { nom, rarete } })
        return res.status(201).json({ message: `Objet ${nom} créé avec succès !` })
    } catch (error) {
        res.status(400).json({ message: "Erreur: L'objet n'a pas pu être créé." })
    }
})


//Modifier un objet
routeurObjets.patch("/objet/:nom", authentifier, exigerRole("MAITRE_DU_JEU"), async(req: Request, res: Response)=>{
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
            return res.status(404).json({erreur: `Erreur: L'objet ${nom} n'existe pas dans le jeu.`})
        }

        //Modifie l'objet
        const objetModifie = await prisma.objet.update({
            where: { id:objet.id},
            data: req.body
        })

        res.status(200).json(objetModifie)


    } catch(e){
        res.status(500).json({erreur: `Erreur: Le serveur ne répond pas lors de la modification de l'objet : ${e}`})
    }
})


//Supprimer objet de la table des objets
routeurObjets.delete("/objet/supprimer/:nom", authentifier, exigerRole("MAITRE_DU_JEU"), async (req: Request, res: Response) => {
    const suppression = await prisma.objet.deleteMany({
        where: {
            nom: {
                equals: req.params.nom as string,
                mode: "insensitive",
            },
        },
    });
    if (suppression.count === 0) {
        res.status(404).json({ erreur: "Erreur: Cet objet n'est pas dans le jeu." })
    } else {
        res.status(200).json({ok: "L'objet a été supprimé."})
    }
});


//Liste des objets dans la table
routeurObjets.get("/objet/", async(req: Request, res: Response)=>{
    const objets = await prisma.objet.findMany({
        orderBy : { id : "asc" }
    });
    res.json(objets)
})

//recuperer 1 objet dans la table
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
            return res.status(404).json({erreur: `Erreur: Cet objet n'est pas dans le jeu`})
        }
        res.json(objet)
    } catch (e) {
        res.status(500).json({erreur: `Erreur: Le serveur ne répond pas lors de la récupération de l'objet: ${e}`})
    }

})



export default routeurObjets