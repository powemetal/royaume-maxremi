import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../css/accueil.css";
import TitreBackground from "../components/titreBackground";

export default function Accueil() {

    const {estConnecte} = useAuth();

  return (
    <div
        className="container-accueil"
        style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <TitreBackground className="titleAccueil">Bienvenue au Royaume!</TitreBackground>
        <div className="container-style" style={{display: "flex"}}>
            <div className="container-accueil-image" style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <p style={{flexGrow: 8}}></p>
                    <p style={{flexGrow: 1}}>Bienvenue sur la page officielle du Royaum MaxRemi! </p>
                    <p style={{flexGrow: 1}}>Nous sommes extrêmement heureux d'enfin pouvoir partager le Royaume avec toute la communauté suite au lancement de la version 1.0!</p>
                    <p style={{flexGrow: 1}}>Inscrivez-vous gratuitement ou connectez-vous pour profiter de toutes les fonctionnalités du jeu!</p>
                    <p style={{flexGrow: 1}}>Le Royaume, c'est des centaines de monstres de DnD, d'objets et d'aventures qui vous attendent!</p>
                    <p style={{flexGrow: 1}}>Rejoignez-nous dès maintenant!</p>
            </div>
        </div>

        {!estConnecte && (
        <div className="flex flex-1 items-end justify-evenly gap-5 container-accueil-boutons">
            <Link to={"/connexion"} className="btn-nav degrade-nav" style={{marginBottom: "4vh"}}>
            Connexion
            </Link>
            <Link to={"/inscription"}  style={{marginBottom: "4vh"}} className="btn-nav degrade-nav">
            Inscription
            </Link>
        </div>
        )}

    </div>
  );
}
