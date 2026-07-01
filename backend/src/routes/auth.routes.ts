import { Router, type Request, type Response} from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../utils/prisma.js"
import { authentifier } from "../middlewares/auth.js"

const router = Router()

// POST /auth/register

router.post("/register", async(req:Request, res:Response) => {
    const { email, user, password } = req.body
    if (!email || !user || !password) {
        return res.status(400).json({erreur: "Une information requise est manquante! (email, user, password)"})
    }
    try {
        const hash = await bcrypt.hash(password, 10)
        const utilisateur = await prisma.utilisateur.create({data: {email, user, password: hash}})
        res.status(201).json({id: utilisateur.id, email: utilisateur.email, user: utilisateur.user})
    } catch {
        res.status(400).json({erreur: "Erreur: le email ou le nom d'utilisateur est déjà pris."})
    }
})