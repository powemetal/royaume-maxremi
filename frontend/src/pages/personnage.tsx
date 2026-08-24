import { useEffect, useState } from "react";
import TitreBackground from "../components/titreBackground";
import "../css/personnage.css";
import OverlayChargement from "../components/overlayChargement";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/backendApi";
import axios from "axios";

export default function Personnage() {
  const [chargement, setChargement] = useState(false);
  const [searchParams] = useSearchParams();
  const [msgErreur, setMsgErreur] = useState("");
  const [dataPerso, setDataPerso] = useState({
    nom: "Nom",
    classe: "Classe",
    niveau: "Niveau",
    pointsDeVie: "PV",
    piecesDOr: "1000",
  });

  async function recupererPersonnage() {
    try {
      setChargement(true);
      const id = searchParams.get("id");
      const personnage = await api.get(`/personnage/recuperer/${id}`);
      console.log(personnage);
      setDataPerso({
        nom: personnage.data.personnage.nom,
        classe: personnage.data.personnage.classe,
        niveau: personnage.data.personnage.niveau,
        pointsDeVie: personnage.data.personnage.pointsDeVie,
        piecesDOr: personnage.data.personnage.piecesDOr,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Message renvoyé par le backend
        const message = error.response?.data?.erreur;
        setMsgErreur(message);
      } else {
        setMsgErreur("Une erreur inattendue est survenue.");
      }
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    recupererPersonnage();
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <OverlayChargement
        chargement={chargement}
        texte="Chargement du personnage..."
      >
        <div className="flex justify-center h-[200px] degrade-rouge gap-5 container-utilisateur text-white">
          <img
            src="https://i.etsystatic.com/22360457/r/il/447352/2199635638/il_fullxfull.2199635638_svz8.jpg"
            alt="Avatar du personnage"
            className="img-perso"
          />
          <div className="flex flex-col justify-center gap-2">
            <p className="text-shadow-lg/50 text-xl">{dataPerso.nom}</p>
            <p className="text-shadow-lg/50 text-md">{dataPerso.classe}</p>
            <button className="btn-nav delete" id="btn-supprimer-perso">
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
            <li className="li-perso flex justify-between">
              <span className="nom-quete">Nom quête</span>
              <div className="flex flex-row gap-5 items-center">
                <span className="prix-recompense">1000$</span>
                <button className="btn-nav delete">Abandonner</button>
              </div>
            </li>
            <li className="li-perso flex justify-between">
              <span className="nom-quete">Nom quête</span>
              <div className="flex flex-row gap-5 items-center">
                <span className="prix-recompense">1000$</span>
                <button className="btn-nav delete">Abandonner</button>
              </div>
            </li>
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
            <li className="li-perso grid grid-cols-3 gap-4 text-center">
              <span className="nom-quete">Nom</span>
              <span className="nom-quete">Type</span>
              <span className="nom-quete">Rareté</span>
            </li>
          </ul>
        </div>
      </OverlayChargement>
    </div>
  );
}
