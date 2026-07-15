import { Router , type Request , type Response } from "express"
import { monstres } from "../api/monstres.js"
import axios from "axios"
import prisma from "../utils/prisma.js"
import { authentifier, exigerRole } from "../middlewares/auth.js"

const routeurMonstres = Router ()

async function recupererMonstre(nom: string){
    try {
        const { data } = await monstres.get(`/${nom.toLowerCase()}`);
        const attack = data.strength > data.dexterity ? data.strength : data.dexterity;
        return {
            nom : data.name,
            pointsDeVie : data.hit_points,
            attaque : attack
        };
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            console.log("Statut HTTP : ", e.response)
        } else {
            console.log("Erreur réseau ou time-out")
        }
        return null;
    }
}


//Ajouter un monstre dans la table monstre
routeurMonstres.post("/monstre/ajouter/:nom", authentifier, exigerRole("MAITRE_DU_JEU"), async (req: Request, res: Response)=>{
    const donnees = await recupererMonstre(req.params.nom as string)
    if (!donnees) {
        return res.status(404).json({erreur: "Erreur: Ce monstre n'existe pas dans le manuel des monstres."})
    }
    try{
        const monstre = await prisma.monstre.create({
            data: donnees as any,
        })
        res.status(201).json({ message: `Le monstre ${monstre.nom} a été ajouté à la base de données.`})
    } catch (e) {
        res.status(400).json({erreur: "Erreur: Ce monstre est deja dans la base de données."})
    }
})


//Modifier un monstre
routeurMonstres.patch("/monstre/:nom", authentifier, exigerRole("MAITRE_DU_JEU"), async(req: Request, res: Response)=>{
    const nom = req.params.nom as string
        //Trouver le monstre
    try{
        const monstre = await prisma.monstre.findFirst({
            where : {
                nom: {
                    equals: nom,
                    mode: "insensitive",    
                }
            }, 
        })
        if (!monstre){
            return res.status(404).json({erreur: `Erreur: Le monstre ${nom} n'existe pas dans le jeu.`})
        }
        //Modifier le monstre

        const monstreModifie = await prisma.monstre.update({
            where: { id:monstre.id},
            data: req.body
        })

        res.json(monstreModifie)


    } catch(e){
        res.status(500).json({erreur: `Erreur: Le serveur ne répond pas lors de la modification du monstre : ${e}`})
    }
})


//Supprimer monstre de la table des monstre
routeurMonstres.delete("/monstre/supprimer/:nom", authentifier, exigerRole("MAITRE_DU_JEU"), async (req: Request, res: Response) => {
    const suppression = await prisma.monstre.deleteMany({
        where: {
            nom: {
                equals: req.params.nom as string,
                mode: "insensitive",
            },
        },
    });
    if (suppression.count === 0) {
        res.status(404).json({ erreur: "Erreur: Ce monstre n'est pas dans le jeu." })
    } else {
        res.status(200).json({ok: "Le monstre a été supprimé."})
    }
});


//Liste des monstres dans la table
routeurMonstres.get("/monstre/", async(req: Request, res: Response)=>{
    const monstres = await prisma.monstre.findMany({
        orderBy : { id : "asc" }
    });
    res.json(monstres)
})

//recuprer 1 monstre dans la table
routeurMonstres.get("/monstre/:nom", async(req: Request, res: Response)=>{
    const nom = req.params.nom as string
    try {
        const monstre = await prisma.monstre.findFirst({
                where : {
                    nom: {
                        equals: nom,
                        mode: "insensitive",    
                    }
                }
        });

        if (!monstre) {
            return res.status(404).json({erreur: `Erreur: Le monstre ${nom} n'existe pas dans le jeu.`})
        }
        res.json(monstre)
    } catch (e) {
        res.status(500).json({erreur: `Erreur: Le serveur ne répond pas lors de la récupération du monstre: ${e}`})
    }

})



export default routeurMonstres