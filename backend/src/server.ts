import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
//import authRoutes from "./routes/auth.routes.js"

import routeurMonstres from "./routes/monstres.routes.js"




dotenv.config()



const app = express()
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.json({message: "API du Royaume de Maxremi!"})
})

app.use("/", routeurMonstres)

//app.use("/auth", authRoutes)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`))