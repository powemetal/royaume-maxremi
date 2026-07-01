import { Router , type Request , type Response } from "express"
import { monstres } from "../../api/monstres.js"
import axios from "axios"
import prisma from "../utils/prisma.js"

const routerMonstres = Router ()

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