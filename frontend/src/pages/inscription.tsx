import "../css/formAuth.css";

import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import FormulaireInscription from "../components/formulaireInscription";

export default function Inscription() {
  const { estConnecte } = useAuth();

  if (estConnecte) {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="m-auto"
    >
       <FormulaireInscription />
      
    </div>
  );
}
