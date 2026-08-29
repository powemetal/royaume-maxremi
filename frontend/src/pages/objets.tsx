import React, { useEffect, useState } from "react";
import TitreBackground from "../components/titreBackground";
import "../css/personnage.css";
import OverlayChargement from "../components/overlayChargement";
import { useNavigate } from "react-router-dom";
import { api } from "../api/backendApi";
import axios from "axios";
import "../css/objets.css";
import BarreRecherche from "../components/barreRecherche";
import { DropdownForm } from "../components/dropdownForm";

interface Objet {
  id: string;
  nom: string;
  rarete: string;
  type: string;
  att: number;
  def: number;
  prix: number;
  typeDegats: string;
}

interface PopupData {
  estOuvert: boolean;
  estAnnulable: boolean;
  fonction?: () => void | Promise<void> | null;
  titre?: string;
  message?: string;
}

interface FiltresObjet {
  type: string;
  rarete: string;
  prix: string;
  recherche: string;
}

const listeTypes = [
  "ARME",
  "ARME_2_MAINS",
  "MUNITION",
  "BOUCLIER",
  "ARMURE",
  "BOTTES",
  "CASQUE",
  "GANT",
  "CAPE",
  "BIJOU",
  "TRINKET",
  "POTION",
  "PARCHEMIN",
  "BAGUETTE",
  "BATON",
  "FOCALISATEUR",
  "OUTIL",
  "SAC",
  "CONTENEUR",
  "MARCHANDISE",
  "AUTRE",
];

const listeRarete = ["COMMUN", "PEU_COMMUN", "RARE", "LEGENDAIRE"];

export default function Objets() {
  const navigate = useNavigate();
  const [chargement, setChargement] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageActuelle, setPageActuelle] = useState<number>(1);
  const filtresInitiaux: FiltresObjet = {
    type: "",
    rarete: "",
    prix: "",
    recherche: "",
  };
  const [filtres, setFiltres] = useState<FiltresObjet>(filtresInitiaux);

  const [popupData, setPopupData] = useState<PopupData>({
    estOuvert: false,
    estAnnulable: false,
    fonction: undefined,
    titre: undefined,
    message: undefined,
  });
  const [listeObjets, setListeObjets] = useState<Objet[]>([
    {
      id: "",
      nom: "",
      rarete: "",
      type: "",
      att: 0,
      def: 0,
      prix: 0,
      typeDegats: "",
    },
  ]);

  async function recupererListeObjets() {
    try {
      setChargement(true);
      const params = new URLSearchParams();
      params.set("page", String(pageActuelle));
      if (filtres.type) params.set("type", filtres.type);
      if (filtres.rarete) params.set("rarete", filtres.rarete);
      if (filtres.prix) {
        params.set("valeur", "prix");
        params.set("ordre", filtres.prix);
      }
      if (filtres.recherche) params.set("recherche", filtres.recherche);
      const reponse = await api.get(`/objet?${params.toString()}`);

      setListeObjets(reponse.data.objets);
      
      if (reponse.data.objets.length == 0) {
        setTotalPages(1);
        setPageActuelle(1);
      } else {
        setTotalPages(reponse.data.totalPages);
        setPageActuelle(reponse.data.currentPage);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Message renvoyé par le backend
        const message =
          error.response?.data?.erreur ||
          error.response?.data?.message ||
          error.message;
        setPopupData({
          estOuvert: true,
          estAnnulable: false,
          fonction: () => navigate("/"),
          titre: "Erreur",
          message: message,
        });
      } else {
        setPopupData({
          estOuvert: true,
          estAnnulable: false,
          fonction: () => navigate("/"),
          titre: "Erreur",
          message: "Une erreur inattendue est survenue.",
        });
      }
      console.error(error);
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    recupererListeObjets();
  }, []);

  useEffect(() => {
    recupererListeObjets();
  }, [pageActuelle]);

  useEffect(() => {
    recupererListeObjets();
  }, [filtres]);

  const pageSuivante = () => {
    if (pageActuelle + 1 > totalPages) return;
    setPageActuelle(pageActuelle + 1);
  };

  const pagePrecedente = () => {
    if (pageActuelle - 1 < 1) return;
    setPageActuelle(pageActuelle - 1);
  };

  const handleFiltreChange = (cle: keyof FiltresObjet, valeur: string) => {
    setFiltres({
      ...filtresInitiaux,
      [cle]: valeur,
    });
    setPageActuelle(1);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <OverlayChargement
        chargement={chargement}
        texte="Chargement des objets..."
      >
        <TitreBackground>Objets</TitreBackground>

        <div className="flex flex-col flex-1 min-h-0 gap-8 h-full">
          <div className="container-form-objets">
            <div className="flex flex-col degrade-rouge px-6 py-4 gap-4">
              <span className="en-tete-objets">Recherche, filtre & tri</span>
              <form
                onSubmit={(e) => handleSubmit(e)}
                className="flex flex-col gap-6"
              >
                <BarreRecherche
                  placeholder="Rechercher un objet..."
                  onSearch={(e) => handleFiltreChange("recherche", e)}
                />
                <div className="flex flex-1 justify-between gap-2">
                  <div className="flex flex-col gap-2">
                    <label className="en-tete-objets">Filtrer par type</label>
                    <DropdownForm
                      choix={listeTypes}
                      choixSelectionne={filtres.type}
                      onSelect={(t) => handleFiltreChange("type", t)}
                      formatLabel={(t) => t.replace(/_/g, " ")}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="en-tete-objets">Filtrer par rareté</label>
                    <DropdownForm
                      choix={listeRarete}
                      choixSelectionne={filtres.rarete}
                      onSelect={(r) => handleFiltreChange("rarete", r)}
                      formatLabel={(t) => t.replace(/_/g, " ")}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="en-tete-objets">Trier par prix</label>
                    <DropdownForm
                      choix={["asc", "desc"]}
                      choixSelectionne={filtres.prix}
                      onSelect={(p) => handleFiltreChange("prix", p)}
                      formatLabel={(p) =>
                        p === "asc" ? "Prix croissant" : "Prix décroissant"
                      }
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          <ul className="flex flex-col flex-1 container-card-objet gap-4">
            <li className="en-tete degrade-rouge card-objet grid grid-cols-7 text-center">
              <span>Nom</span>
              <span>Type</span>
              <span>Rareté</span>
              <span>ATT</span>
              <span>DEF</span>
              <span>Type</span>
              <span>Prix</span>
            </li>

            {listeObjets.length > 0 ? (
              listeObjets.map((o) => (
                <li
                  key={o.id}
                  className="card-objet grid grid-cols-7 text-center nom-quete items-center h-15 px-2"
                >
                  <span className="truncate">{o.nom}</span>
                  <span className="truncate">{o.type}</span>
                  <span className="truncate">{o.rarete}</span>
                  <span className="truncate">{o.att}</span>
                  <span className="truncate">{o.def}</span>
                  <span className="truncate">{o.typeDegats}</span>
                  <span className="truncate">{o.prix}$</span>
                </li>
              ))
            ) : (
              <li className="text-center card-objet nom-quete p-2">
                <span>
                  Aucun objet du Royaume ne correspond à ces critères.
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className="flex gap-2 justify-center mt-4">
          <button
            className="btn-nav degrade-rouge cinzel"
            onClick={() => pagePrecedente()}
          >
            ◄
          </button>
          <span className="flex items-center justify-center texte-nb-pages text-amber-200">
            Page {pageActuelle}/{totalPages}
          </span>
          <button
            className="btn-nav degrade-rouge cinzel"
            onClick={() => pageSuivante()}
          >
            ►
          </button>
        </div>
      </OverlayChargement>
      {popupData.estOuvert && (
        <div
          className="popup-overlay"
          onClick={() =>
            popupData.estAnnulable
              ? setPopupData((prev) => ({
                  ...prev,
                  estOuvert: false,
                }))
              : null
          }
        >
          <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-8">{popupData.titre}</h2>
            <p className="text-white">{popupData.message}</p>
            <div className="popup-actions flex gap-4 justify-center mt-8">
              {popupData.estAnnulable && (
                <button
                  type="button"
                  className="flex w-full justify-center items-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 "
                  onClick={() =>
                    setPopupData((prev) => ({
                      ...prev,
                      estOuvert: false,
                    }))
                  }
                >
                  Annuler
                </button>
              )}
              <button
                type="button"
                className="flex w-full justify-center items-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={() => {
                  setChargement(true);
                  popupData.fonction?.();
                  setPopupData((prev) => ({
                    ...prev,
                    estOuvert: false,
                  }));
                }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
