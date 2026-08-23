import { useState } from "react";
import "../css/formAuth.css";
import OverlayChargement from "./overlayChargement";
import { api } from "../api/backendApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function FormulaireConnexion() {
  const [chargement, setChargement] = useState<boolean>(false);
  const [msgErreur, setMsgErreur] = useState<string>("");
  const navigate = useNavigate();
  const { seConnecter } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    mdp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setMsgErreur("");
      setChargement(true);

      const res = await api.post("/auth/login", {
        email: formData.email,
        mdp: formData.mdp,
      });

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
      setFormData({
        email: "",
        mdp: "",
      });
    }
  }

  return (
    <OverlayChargement chargement={chargement} texte="Connexion au royaume...">
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 shadow-xl/30 formulaire-auth degrade-rouge">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Logo MaxRemi"
            src="/src/assets/images/MaxRemiLogoBlanc.png"
            className="mx-auto h-20 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
            Se connecter au Royaume
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-100"
              >
                Adresse email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="mdp"
                className="block text-sm font-medium text-gray-100"
              >
                Mot de passe
              </label>
              <div className="mt-2">
                <input
                  id="mdp"
                  name="mdp"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.mdp}
                  onChange={handleChange}
                  className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Se connecter
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-200">
            Vous n'avez pas de compte ?{" "}
            <a
              href="/inscription"
              className="font-semibold text-indigo-400 hover:text-indigo-200"
            >
              S'inscrire
            </a>
          </p>
          {msgErreur && (
            <p
              style={{
                color: "red",
                fontWeight: 700,
                textAlign: "center",
                marginTop: "1em",
              }}
            >
              {msgErreur}
            </p>
          )}
        </div>
      </div>
    </OverlayChargement>
  );
}
