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
import FormulaireInscription from "../components/formulaireInscription";

export default function Inscription() {
  const { seConnecter, estConnecte } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [mdp, setMdp] = useState<string>("");
  
  const navigate = useNavigate();

  if (estConnecte) {
    return <Navigate to="/" replace />;
  }

  

  return (
    <div
      className="container-inscription flex flex-1 flex-col my-auto"
    >
       <FormulaireInscription />
      
    </div>
  );
}
