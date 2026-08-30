import OverlayChargement from "../components/overlayChargement";
import TitreBackground from "../components/titreBackground";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../api/backendApi";
import { DropdownForm } from "../components/dropdownForm";

const listeClasses = ["GUERRIER", "MAGE", "VOLEUR", "CLERC"];

export default function CreerPerso() {
  const [chargement, setChargement] = useState<boolean>(false);
  const [msgErreur, setMsgErreur] = useState<string>("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    classe: "",
    avatarUrl: "",
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
      console.log(formData);

      await api.post("/personnage/creer", {
        nom: formData.nom,
        classe: formData.classe,
        avatarUrl: formData.avatarUrl,
      });

      navigate("/compte");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Message renvoyé par le backend
        const message =
          error.response?.data?.erreur || "Informations incorrectes";
        setMsgErreur(message);
      } else {
        setMsgErreur("Une erreur inattendue est survenue.");
      }
      console.error(error);
    } finally {
      setChargement(false);
      setFormData({
        nom: "",
        classe: "",
        avatarUrl: "",
      });
    }
  }

  return (
    <div className="flex flex-1 flex-col min-h-0 justify-center items-center">
      <TitreBackground>Créer un personnage</TitreBackground>
      <div>
        <OverlayChargement
          chargement={chargement}
          texte="Création du personnage..."
        >
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 shadow-xl/30 formulaire-auth degrade-rouge">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="nom"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Nom du personnage
                  </label>
                  <div className="mt-2">
                    <input
                      id="nom"
                      name="nom"
                      type="text"
                      required
                      value={formData.nom}
                      onChange={handleChange}
                      className="cinzel block w-full rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="classe"
                    className="block text-sm font-medium text-gray-100"
                  >
                    Classe
                  </label>
                  <div className="mt-2">
                    <DropdownForm
                      className="w-full"
                      choix={listeClasses}
                      choixSelectionne={formData.classe}
                      onSelect={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          classe: e,
                        }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="avatarUrl"
                    className="block text-sm font-medium text-gray-100"
                  >
                    URL de l'avatar
                  </label>
                  <div className="mt-2">
                    <input
                      id="avatarUrl"
                      name="avatarUrl"
                      type="url"
                      value={formData.avatarUrl}
                      onChange={handleChange}
                      className="cinzel block w-full rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Envoyer
                  </button>
                </div>
              </form>

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
      </div>
    </div>
  );
}
