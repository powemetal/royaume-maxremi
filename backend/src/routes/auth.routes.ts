import { Router, type Request, type Response} from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../utils/prisma.js"
import { authentifier } from "../middlewares/auth.js"

const router = Router()


// auth.routes.ts contient les fonctions nécessaire à un utilisateur pour s'enregistrer, se connecter et voir ses informations à lui.

// POST /auth/register

router.post("/register", async(req:Request, res:Response) => {
    const { email, pseudo, mdp } = req.body
    if (!email || !pseudo || !mdp) {
        return res.status(400).json({erreur: "Une information requise est manquante! (email, pseudo, mot de passe)"})
    }
    try {
        const hash = await bcrypt.hash(mdp, 10)
        const utilisateur = await prisma.utilisateur.create({data: {email, pseudo, mdp: hash}})
        res.status(201).json({id: utilisateur.id, email: utilisateur.email, pseudo: utilisateur.pseudo})
    } catch {
        res.status(400).json({erreur: "Erreur: le email ou le nom d'utilisateur est déjà pris."})
    }
})


// POST /auth/login

router.post("/login", async (req:Request, res:Response) => {
    const { email, mdp } = req.body
    const utilisateur = await prisma.utilisateur.findUnique({where: {email}})

    // rejeter si le nom d'utilisateur n'est pas bon
    if (!utilisateur) return res.status(401).json({erreur: "Identifiants invalides."})

    // rejeter si le mdp ne correspond pas a la version hachée dans la BD
    const ok = await bcrypt.compare(mdp, utilisateur.mdp)
    if (!ok) return res.status(401).json({erreur: "Identifiants invalides."})

    // signature du token avec le JWT_SECRET de .env
    const token = jwt.sign(
        { sub: utilisateur.id, role: utilisateur.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    )
    res.json({token})   
})

// GET /auth/me

router.get("/me", async (req:Request, res: Response) => {
    const id = (req as any).utilisateur.sub
    const utilisateur = await prisma.utilisateur.findUnique({
        where: {id},
        select: {id:true, email:true, pseudo:true, role: true/*, createdAt: true*/},
    })
    res.json(utilisateur)
})

export default router