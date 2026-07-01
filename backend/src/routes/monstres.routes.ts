import { Router , type Request , type Response } from "express"
import { monstres } from "../../api/monstres.js"
import axios from "axios"
import prisma from "../utils/prisma.js"

const routeurMonstres = Router ()

async function recupererMonstre(nom: string){
    try {
        const { data } = await monstres.get(`/${nom.toLowerCase()}`);
        const attack = data.strength > data.dexterity ? data.strength : data.dexterity;
        return {
            nom : data.name,
            pointsDeVie : data.hp,
            attaque : attack
        };
    } catch (e) {
        if (axios.isAxiosError(e) && e.response) {
            console.log("Statut HTTP : ", e.response)
        } else {
            console.log("Erreur reseau ou timeout")
        }
        return null;
    }
}

routeurMonstres.post("/ajouterMonstre/:nom", async (req: Request, res: Response)=>{
    const donnees = await recupererMonstre(req.params.nom as string)
    if (!donnees) {
        return res.status(404).json({erreur: "Ce monstre n'existe pas dans le manuel des monstres"})
    }
    try{
        const monstre = await prisma.Monstre.create({
            data: donnees as any,
        })
        res.status(201).json({ message: `${monstre.nom} a été ajouté a dans la table: monstres de la base de données`})
    } catch (e) {
        res.status(400).json({erreur: "Ce monstre est deja dans la base de données"})
    }
})