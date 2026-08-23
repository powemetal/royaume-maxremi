import { useState } from "react";
import "../css/formAuth.css";
import OverlayChargement from "./overlayChargement";
import { api } from "../api/backendApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function FormulaireInscription() {
  const [chargement, setChargement] = useState<boolean>(false);
  const [msgErreur, setMsgErreur] = useState<string>("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pseudo: "",
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

      await api.post("/auth/register", {
        pseudo: formData.pseudo,
        email: formData.email,
        mdp: formData.mdp,
      });

      navigate("/connexion");
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
      setFormData({
        pseudo: "",
        email: "",
        mdp: "",
      });
      setChargement(false);
    }
  }

  return (
    <OverlayChargement
      chargement={chargement}
      texte="Inscription au royaume..."
    >
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 shadow-xl/30 formulaire-auth degrade-rouge">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Logo MaxRemi"
            src="/src/assets/images/MaxRemiLogoBlanc.png"
            className="mx-auto h-20 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
            Se créer un compte
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="pseudo"
                className="block text-sm font-medium text-gray-100"
              >
                Pseudonyme
              </label>
              <div className="mt-2">
                <input
                  id="pseudo"
                  name="pseudo"
                  type="text"
                  required
                  autoComplete="username"
                  value={formData.pseudo}
                  onChange={handleChange}
                  className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                />
              </div>
            </div>

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
                  autoComplete="new-password"
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
                S'inscrire
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-200">
            Vous avez déjà un compte ?{" "}
            <a
              href="/connexion"
              className="font-semibold text-indigo-400 hover:text-indigo-200"
            >
              Se connecter
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
