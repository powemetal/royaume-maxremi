import "../css/navbar.css";
import DropdownAdmin from "./dropdownAdmin";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { estConnecte, estAdmin, seDeconnecter } = useAuth();
  const navigate = useNavigate();

  function deconnexion() {
    seDeconnecter();
    navigate("/");
  }

  return (
    <nav className="container-nav">
      <div className="container-logo">
        <Link to={"/"}>
          <img
            src="/src/assets/images/MaxRemiLogoBlanc.png"
            alt="Logo Maxremi"
            id="logo-maxremi"
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex justify-end gap-3">
          {estAdmin && <DropdownAdmin />}
          {!estConnecte ? (
            <>
              <Link
                to={"/inscription"}
                className="justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20"
              >
                S'inscrire
              </Link>
              <Link
                to={"/connexion"}
                className="justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20"
              >
                Se connecter
              </Link>
            </>
          ) : (
            <button
              onClick={deconnexion}
              className="justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20"
            >
              Se déconnecter
            </button>
          )}
        </div>
        <div className="flex flex-1 flex-wrap items-end justify-evenly gap-5">
          <Link to={"/compte"} className="btn-nav degrade-rouge">
            Mon compte
          </Link>
          <Link to={"/monstres"} className="btn-nav degrade-rouge">
            Monstres
          </Link>
          <Link to={"/objets"} className="btn-nav degrade-rouge">
            Objets
          </Link>
        </div>
      </div>
    </nav>
  );
}
