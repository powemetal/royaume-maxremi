import { type Request, type Response, type NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


export type JwtPayload = {sub:number, role: "JOUEUR" | "MAITRE_DU_JEU"}

// verifie le token JWT et attache l'utilisateur a req.user
export function authentifier(req: Request, res: Response, next: NextFunction){
    const header = req.headers.authorization
    if(!header?.startsWith("Bearer ")){
        return res.status(401).json({erreur: "Token Manquant!"})
    }

    const token = header.split(" ")[1]

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload
        (req as any).user = payload
        next()
    } catch {
        res.status(401).json({erreur:"Accès refusé! Token invalide ou expiré!"})

    }
}

// fonction pour exiger un role pour acceder a une route, a brancher apres authentifier
export function exigerRole(role: "MAITRE_DU_JEU" | "JOUEUR"){
    return (req: Request, res:Response, next:NextFunction) => {
        if((req as any).user.role !== role) {
            return res.status(403).json({erreur: "Accès refusé! Vous n'avez pas les droits."})
        }
        next()
    }
}