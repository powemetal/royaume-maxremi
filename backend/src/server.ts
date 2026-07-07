import express, { type Request, type Response } from "express"
import dotenv from "dotenv"
import routerUtilisateur from "./routes/utilisateur.routes.js"
import routeurMonstres from "./routes/monstres.routes.js"
import routeurObjets from "./routes/objet.routes.js"
import routeurQuetes from "./routes/quete.routes.js"
import authRoutes from "./routes/auth.routes.js"
import routerInventaire from "./routes/inventaire.routes.js"
import routerPersoQuete from "./routes/persoquete.routes.js"
import routerPersonnage from "./routes/personnage.routes.js";

dotenv.config()

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API du Royaume de Maxremi!" });
});

app.use("/", routeurMonstres);
app.use("/", routeurObjets);
app.use("/", routeurQuetes);
app.use("/utilisateur", routerUtilisateur);
app.use("/personnage", routerPersonnage);
app.use("/inventaire", routerInventaire);
app.use("/persoQuete", routerPersoQuete)
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
