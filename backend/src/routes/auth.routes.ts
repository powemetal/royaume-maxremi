import { Router, type Request, type Response} from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../utils/prisma.js"
import { authentifier } from "../middlewares/auth.js"

const router = Router()


// auth.routes.ts contient les fonctions nécessaire à un utilisateur pour s'enregistrer, se connecter et voir ses informations à lui.

// POST /auth/register

router.post("/register", async(req:Request, res:Response) => {
    const { email, pseudo, mdp, codeAdmin } = req.body

    if (!email || !pseudo || !mdp) {
        return res.status(400).json({erreur: "Erreur: Une information requise est manquante. (email, pseudo, mot de passe)"})
    }
    let attributionRole: "JOUEUR" | "MAITRE_DU_JEU" = "JOUEUR";

    if (codeAdmin && codeAdmin === process.env.CODE_ADMIN) {
        attributionRole = "MAITRE_DU_JEU";
    }

    try {
        const hash = await bcrypt.hash(mdp, 10)
        const utilisateur = await prisma.utilisateur.create({data: {email, pseudo, mdp: hash, role: attributionRole}})
        res.status(201).json({id: utilisateur.id, email: utilisateur.email, pseudo: utilisateur.pseudo})
    } catch {
        res.status(400).json({erreur: "Erreur: Le email ou le nom d'utilisateur est déjà pris."})
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
    if (!ok) return res.status(401).json({erreur: "Erreur: Identifiants invalides."})

    // signature du token avec le JWT_SECRET de .env
    const token = jwt.sign(
        { sub: utilisateur.id, role: utilisateur.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
    )
    res.json({token})   
})

// GET /auth/me

router.get("/me", authentifier, async (req:Request, res: Response) => {
    try {
        const id = (req as any).utilisateur?.sub

        if (!id) {
            return res.status(401).json({ erreur: "Accès refusé. Vous devez d'abord vous connecter."})
        }

        const utilisateur = await prisma.utilisateur.findUnique({
            where: {id},
            select: {id:true, email:true, pseudo:true, role: true/*, createdAt: true*/},
        })

        if (!utilisateur) {
            return res.status(404).json({ erreur: "Erreur: Utilisateur introuvable."})
        }

        return res.json(utilisateur)
    } catch(e) {
        return res.status(500).json({erreur: "Erreur: Problème au niveau du serveur."})
    }
})

export default router