import { useEffect, useState } from "react";
import TitreBackground from "../components/titreBackground";
import "../css/personnage.css";
import OverlayChargement from "../components/overlayChargement";
import { useNavigate } from "react-router-dom";
import { api } from "../api/backendApi";
import axios from "axios";
import "../css/objets.css";
import BarreRecherche from "../components/barreRecherche";
import { DropdownForm } from "../components/dropdownForm";

interface Objet {}

interface PopupData {
  estOuvert: boolean;
  estAnnulable: boolean;
  fonction?: () => void | Promise<void> | null;
  titre?: string;
  message?: string;
}

export default function Objets() {
  const navigate = useNavigate();
  const [chargement, setChargement] = useState<boolean>(false);
  const [popupData, setPopupData] = useState<PopupData>({
    estOuvert: false,
    estAnnulable: false,
    fonction: undefined,
    titre: undefined,
    message: undefined,
  });
  const [listeObjets, setListeObjets] = useState<Objet[]>();

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <OverlayChargement chargement={chargement}>
        <TitreBackground>Objets</TitreBackground>
        <div className="container-perso flex flex-col min-h-0">
          <div className="flex flex-col degrade-rouge px-6 py-4 gap-4">
            <span className="en-tete-objets">Recherche et tri</span>
            <form action="" className="flex flex-col gap-4">
              <BarreRecherche placeholder="Rechercher un objet..." />
              <div className="flex flex-1 justify-between">
                <DropdownForm choix={["Type-1", "Type-2", "Type-3"]} />
                <DropdownForm choix={["Type-1", "Type-2", "Type-3"]} />
                <DropdownForm choix={["Type-1", "Type-2", "Type-3"]} />
              </div>
            </form>
          </div>
        </div>
        <ul className="">
          <li className=""></li>
        </ul>
      </OverlayChargement>
    </div>
  );
}
