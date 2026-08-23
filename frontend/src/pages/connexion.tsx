import "../css/formAuth.css";
import TitreBackground from "../components/titreBackground";
import { useAuth } from "../context/AuthContext";
import type React from "react";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import OverlayChargement from "../components/overlayChargement";
import { api } from "../api/backendApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FormulaireConnexion from "../components/formulaireConnexion";

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
    <div className="container-inscription flex flex-1 flex-col my-auto">
      <FormulaireConnexion />
    </div>
  );
}
