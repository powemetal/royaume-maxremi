import "../css/connexion.css";
import TitreBackground from "../components/titreBackground";

export default function Connexion() {
  return (
    <div
      className="container-Connexion"
      style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
    >
      <TitreBackground className="titleConnexion">Connexion</TitreBackground>
      <div
        className="container-Connexion-form"
        style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <label>Nom d'utilisateur :</label>
        <input type="" value="" required placeholder="Votre nom" />
        <label>Mot de passe :</label>
        <input type="" value="" required placeholder="Mot de passe" />
        <button>Connexion</button>
      </div>
    </div>
  );
}
