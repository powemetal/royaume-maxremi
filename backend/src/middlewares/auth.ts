import { type Request, type Response, type NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export type JwtPayload = { sub: number; role: "JOUEUR" | "MAITRE_DU_JEU" }

// vérifie le token JWT et attache l'utilisateur à req.utilisateur
export function authentifier(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ erreur: "Accès refusé. Votre token est manquant.", code: "TOKEN_INVALIDE" })
  }

  const token = header.split(" ")[1]

  if (!token) {
    return res.status(401).json({ erreur: "Accès refusé. Format du token invalide.", code: "TOKEN_INVALIDE" })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error("JWT_SECRET n'est pas défini dans les variables d'environnement.")
  }

  try {
    // ✅ Passage par 'unknown' pour satisfaire le compilateur TypeScript
    const payload = jwt.verify(token, secret) as unknown as JwtPayload
    ;(req as any).utilisateur = payload
    next()
  } catch {
    return res.status(401).json({ erreur: "Accès refusé. Votre token est invalide ou expiré.", code: "TOKEN_INVALIDE" })
  }
}

// fonction pour exiger un rôle pour accéder à une route, à brancher après authentifier
export function exigerRole(role: "MAITRE_DU_JEU" | "JOUEUR") {
  return (req: Request, res: Response, next: NextFunction) => {
    const utilisateur = (req as any).utilisateur as JwtPayload | undefined

    if (!utilisateur || utilisateur.role !== role) {
      return res.status(403).json({ erreur: "Accès refusé. Vous n'avez pas les droits." })
    }
    next()
  }
}