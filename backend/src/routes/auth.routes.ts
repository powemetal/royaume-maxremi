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


// POST /auth/login

router.post("/login", async (req:Request, res:Response) => {
    const { email, password } = req.body
    const utilisateur = await prisma.utilisateur.findUnique({where: {email}})

    // rejeter si le nom d'utilisateur n'est pas bon
    if (!utilisateur) return res.status(401).json({erreur: "Identifiants invalides."})

    // rejeter si le mdp ne correspond pas a la version hachée dans la BD
    const ok = await bcrypt.compare(password, utilisateur.password)
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
        select: {id:true, email:true, user:true, role: true/*, createdAt: true*/},
    })
    res.json(utilisateur)
})

export default router