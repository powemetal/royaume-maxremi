import "../css/formAuth.css";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import FormulaireConnexion from "../components/formulaireConnexion";

export default function Connexion() {
  const { estConnecte } = useAuth();

  if (estConnecte) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="m-auto">
      <FormulaireConnexion />
    </div>
  );
}
