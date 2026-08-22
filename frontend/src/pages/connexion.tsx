import "../css/connexion.css";
import TitreBackground from "../components/titreBackground";
import { useAuth } from "../context/AuthContext";
import type React from "react";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import OverlayChargement from "../components/overlayChargement";
import { api } from "../api/backendApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Connexion() {
  const { seConnecter, estConnecte } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [mdp, setMdp] = useState<string>("");
  const [chargement, setChargement] = useState<boolean>(false);
  const [msgErreur, setMsgErreur] = useState<string>("");
  const navigate = useNavigate();

  if (estConnecte) {
    return <Navigate to="/" replace />;
  }

  async function soumettreConnexion(e: React.SubmitEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setMsgErreur("");
      setChargement(true);

      const res = await api.post("/auth/login", { email, mdp });
      const { token, estAdmin } = res.data;
      seConnecter(token, estAdmin);

      navigate("/personnages");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Message renvoyé par le backend
        const message =
          error.response?.data?.erreur || "Identifiants incorrects";
        setMsgErreur(message);
      } else {
        setMsgErreur("Une erreur inattendue est survenue.");
      }
      console.error(error);
    } finally {
      setChargement(false);
      setMdp("");
    }
  }

  return (
    <div
      className="container-Connexion"
      style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
    >
      <TitreBackground className="titleConnexion">Connexion</TitreBackground>
      <OverlayChargement
        chargement={chargement}
        texte="Connexion au royaume..."
      >
        <form
          onSubmit={soumettreConnexion}
          className="container-Connexion-form"
          style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
        >
          <label>Nom d'utilisateur :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Votre nom"
          />
          <label>Mot de passe :</label>
          <input
            type="password"
            value={mdp}
            onChange={(e) => setMdp(e.target.value)}
            required
            placeholder="Mot de passe"
          />
          <button>Connexion</button>
          {msgErreur && (
            <p style={{ color: "red", fontWeight: "bold" }}>{msgErreur}</p>
          )}
        </form>
      </OverlayChargement>
    </div>
  );
}
