import { useEffect, useState } from "react";
import TitreBackground from "../components/titreBackground";
import "../css/personnage.css";
import OverlayChargement from "../components/overlayChargement";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../api/backendApi";
import axios from "axios";
interface PersoQuete {
  id: string;
  statut: string;
  quete: {
    id: string;
    nom: string;
    description: string;
    difficulte: string;
    recompense: number;
  };
}

interface Inventaire {
  id: string;
  objet: {
    id: string;
    nom: string;
    rarete: string;
    type: string;
    prix: number;
    att: number | null;
    def: number | null;
    description: string | null;
  };
}

interface DataPerso {
  nom: string;
  classe: string;
  niveau: string;
  pointsDeVie: string;
  piecesDOr: string;
  avatarUrl?: string;
  quetes: PersoQuete[];
  inventaire: Inventaire[];
}

interface PopupData {
  estOuvert: boolean;
  fonction?: () => void | Promise<void>;
  titre?: string;
  message?: string;
}

export default function Personnage() {
  const navigate = useNavigate();
  const [chargement, setChargement] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [popupData, setPopupData] = useState<PopupData>({
    estOuvert: false,
    fonction: undefined,
    titre: undefined,
    message: undefined,
  });
  const [msgErreur, setMsgErreur] = useState<string>("");
  const [dataPerso, setDataPerso] = useState<DataPerso>({
    nom: "Nom",
    classe: "Classe",
    niveau: "Niveau",
    pointsDeVie: "PV",
    piecesDOr: "1000",
    avatarUrl: undefined,
    quetes: [],
    inventaire: [],
  });

  async function recupererInfosPersonnage() {
    try {
      setChargement(true);
      const idPerso = searchParams.get("id");
      const [personnage, quetes, inventaire] = await Promise.all([
        api.get(`/personnage/recuperer/${idPerso}`),
        api.get(`/persoQuete/${idPerso}?statut=EN_COURS`),
        api.get(`/inventaire/${idPerso}`),
      ]);
      setDataPerso({
        nom: personnage.data.personnage.nom,
        classe: personnage.data.personnage.classe,
        niveau: personnage.data.personnage.niveau,
        pointsDeVie: personnage.data.personnage.pointsDeVie,
        piecesDOr: personnage.data.personnage.piecesDOr,
        avatarUrl: personnage.data.personnage.avatarUrl,
        quetes: quetes.data,
        inventaire: inventaire.data,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Message renvoyé par le backend
        const message = error.response?.data?.erreur;
        setMsgErreur(message);
      } else {
        setMsgErreur("Une erreur inattendue est survenue.");
      }
      console.error(error);
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    recupererInfosPersonnage();
  }, []);

  async function abandonnerQuete(id: string) {
    try {
      await api.patch(`/persoQuete/journal/echouer/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Message renvoyé par le backend
        const message = error.response?.data?.erreur;
        setMsgErreur(message);
      } else {
        setMsgErreur("Une erreur inattendue est survenue.");
      }
      console.error(error);
    } finally {
      recupererInfosPersonnage();
    }
  }

  async function supprimerPersonnage() {
    try {
      const idPerso = searchParams.get("id");
      await api.delete(`/personnage/supprimer/${idPerso}`);
      navigate("/compte");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Message renvoyé par le backend
        const message = error.response?.data?.erreur;
        setMsgErreur(message);
      } else {
        setMsgErreur("Une erreur inattendue est survenue.");
      }
      console.error(error);
      recupererInfosPersonnage();
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <OverlayChargement
        chargement={chargement}
        texte="Chargement du personnage..."
      >
        <div className="flex justify-center h-[200px] degrade-rouge gap-5 container-utilisateur text-white">
          <img
            src={dataPerso.avatarUrl}
            alt="Avatar du personnage"
            className="img-perso"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png";
            }}
          />
          <div className="flex flex-col justify-center gap-2">
            <p className="text-shadow-lg/50 text-xl">{dataPerso.nom}</p>
            <p className="text-shadow-lg/50 text-md">{dataPerso.classe}</p>
            <button
              onClick={() => setPopupData({
                estOuvert: true,
                fonction: () => supprimerPersonnage(),
                titre: "Suppression du personnage",
                message: "Êtes-vous sûr de vouloir supprimer votre personnage ?"
              })}
              className="btn-nav delete"
              id="btn-supprimer-perso"
            >
              Supprimer le personnage
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 my-auto">
            <div className="flex flex-col items-end">
              <p className="mr-1 label-stats">Niveau :</p>
              <p className="mr-1 label-stats">PV :</p>
              <p className="mr-1 label-stats">Argent :</p>
            </div>
            <div className="flex flex-col">
              <p>{dataPerso.niveau}</p>
              <p>{dataPerso.pointsDeVie}</p>
              <p>{dataPerso.piecesDOr} $</p>
            </div>
          </div>
        </div>
        <TitreBackground>Quêtes</TitreBackground>
        <div className="container-personnages container-perso flex flex-col overflow-y-auto min-h-0">
          <ul className="liste-personnages flex flex-col">
            <div className="liste-personnages grid grid-cols-7 gap-4 text-center en-tete degrade-rouge">
              <span className="col-span-2">Nom</span>
              <span className="col-span-2">Difficulté</span>
              <span className="col-span-2">Récompense</span>
            </div>
            {dataPerso.quetes.length > 0 ? (
              dataPerso.quetes.map((q) => (
                <li
                  key={q.id}
                  className="li-perso grid grid-cols-7 gap-4 text-center"
                >
                  <span className="nom-quete col-span-2">{q.quete.nom}</span>
                  <span className="nom-quete col-span-2">
                    {q.quete.difficulte}
                  </span>
                  <span className="prix-recompense col-span-2">
                    {q.quete.recompense}$
                  </span>
                  <button
                    className="btn-nav delete truncate"
                    onClick={() =>
                      setPopupData({
                        estOuvert: true,
                        fonction: () => abandonnerQuete(q.id),
                        titre: "Abandonner la quête",
                        message:
                          "Êtes-vous sûr de vouloir abandonner cette quête ?",
                      })
                    }
                  >
                    Abandonner
                  </button>
                </li>
              ))
            ) : (
              <li className="li-perso flex justify-center">
                <span className="nom-quete">
                  Vous n'avez aucune quête en cours.
                </span>
              </li>
            )}
          </ul>
        </div>
        <TitreBackground>Inventaire</TitreBackground>
        <div className="container-personnages container-perso flex flex-col overflow-y-auto flex-1 min-h-0">
          <div className="liste-personnages grid grid-cols-3 gap-4 text-center en-tete degrade-rouge">
            <span>Nom</span>
            <span>Type</span>
            <span>Rareté</span>
          </div>
          <ul className="liste-personnages flex flex-col">
            <li className="li-perso grid grid-cols-3 gap-4 text-center">
              <span className="nom-quete">Épée</span>
              <span className="nom-quete">Combat</span>
              <span className="nom-quete">Légendaire</span>
            </li>
            {dataPerso.inventaire.length > 0 ? (
              dataPerso.inventaire.map((o) => (
                <li
                  key={o.id}
                  className="li-perso grid grid-cols-3 gap-4 text-center"
                >
                  <span className="nom-quete">{o.objet.nom}</span>
                  <span className="nom-quete">{o.objet.type}</span>
                  <span className="nom-quete">{o.objet.rarete}</span>
                </li>
              ))
            ) : (
              <li className="li-perso flex justify-center">
                <span className="nom-quete">
                  Vous n'avez aucun objet dans votre inventaire.
                </span>
              </li>
            )}
          </ul>
        </div>
      </OverlayChargement>

      {popupData.estOuvert && (
        <div
          className="popup-overlay"
          onClick={() =>
            setPopupData((prev) => ({
              ...prev,
              estOuvert: false,
            }))
          }
        >
          <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-8">{popupData.titre}</h2>
            <p className="text-white">{popupData.message}</p>
            <div className="popup-actions flex gap-4 justify-center mt-8">
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
