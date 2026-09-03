import TitreBackground from "../components/titreBackground";
import { useState, useEffect } from "react";
import { api } from "../api/backendApi";
import "../css/monstres.css";

import OverlayChargement from "../components/overlayChargement";
import { formatAlignement, formatTypeMonstre, formatGrosseur } from "../utils/formatMonstres";
import type { Monstre, ReponseListeMonstres, } from "../utils/interfaces";
import { valeursGrosseur, valeursTypeMonstre, valeursAlignement, type Grandeur, type TypeMonstre, type Alignement } from "../utils/types";

export default function Monstres() {
  const [listeMonstres, setListeMonstres] = useState<Monstre[]>([]);
  
  const [chargement, setChargement] = useState<boolean>(true);
  const [filtreNom, setFiltreNom] = useState<string>("");
  const [filtreGrandeur, setFiltreGrandeur] = useState<Grandeur | null>(null);
  const [filtreType, setFiltreType] = useState<TypeMonstre | null>(null);
  const [filtreAlignement, setFiltreAlignement] = useState<Alignement | null>(null);

  const recupererListeMonstres = async () => {
    try {
      setChargement(true);
  
      const reponse = await api.get<ReponseListeMonstres>("/monstres/");
      setListeMonstres(reponse.data.resultats);
    } catch {
  
    } finally {
      setChargement(false);
    }
  };

    const monstresFiltres = listeMonstres.filter((m) => {
    if (filtreNom && !m.nom.toLowerCase().includes(filtreNom.toLowerCase())) return false;
    if (filtreGrandeur && m.grandeur !== filtreGrandeur) return false;
    if (filtreType && m.typeMonstre !== filtreType) return false;
    if (filtreAlignement && m.alignement !== filtreAlignement) return false;
    return true;
  });

  useEffect(() => {
    recupererListeMonstres();
  }, []);



  return (
    <div className="container-compte flex flex-col grow">
      <OverlayChargement chargement={chargement} texte="Chargement des monstres...">

        <TitreBackground>Monstres</TitreBackground>

        <div className="intro-monstres flex flex-col items-center text-center p-6 mb-6">
          <p className="intro-texte">Voici les monstres qui peuplent les terres de MaxRemi. Certains sont hostiles, d’autres simplement mystérieux. Leur puissance varie selon leur nature et leur alignement. Explore leur fiche pour mieux comprendre les dangers du royaume.</p>
        </div>

        <div className="container-form-objets">
          <div className="flex flex-col degrade-rouge px-6 py-4 gap-4">
            <span className="en-tete-objets">Recherche, filtre & tri</span>

            <form className="flex flex-col gap-6">
              <input type="text" className="input-recherche w-full p-3 rounded-md bg-white/10 border border-white/20 text-white" placeholder="Rechercher un monstre..." value={filtreNom} onChange={(e) => setFiltreNom(e.target.value)} />

              <div className="flex flex-1 justify-between gap-2">
                <div className="flex flex-col gap-2">
                  <label className="en-tete-objets">Filtrer par type</label>
                  <select className="select-recherche p-3 rounded-md bg-white/10 border border-white/20 text-white" value={filtreType ?? ""} onChange={(e) => setFiltreType(e.target.value ? (e.target.value as TypeMonstre) : null)}>
                    <option value="">Tous</option>
                    {valeursTypeMonstre.map((t) => (
                      <option key={t} value={t}>
                        {formatTypeMonstre[t]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="en-tete-objets">Filtrer par taille</label>
                  <select className="select-recherche p-3 rounded-md bg-white/10 border border-white/20 text-white" value={filtreGrandeur ?? ""} onChange={(e) => setFiltreGrandeur(e.target.value ? (e.target.value as Grandeur) : null)}>
                    <option value="">Toutes</option>
                    {valeursGrosseur.map((g) => (
                      <option key={g} value={g}>
                        {formatGrosseur[g]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="en-tete-objets">Filtrer par alignement</label>
                  <select className="select-recherche p-3 rounded-md bg-white/10 border border-white/20 text-white" value={filtreAlignement ?? ""} onChange={(e) => setFiltreAlignement(e.target.value ? (e.target.value as Alignement) : null)}>
                    <option value="">Tous</option>
                    {valeursAlignement.map((a) => (
                      <option key={a} value={a}>
                        {formatAlignement[a]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="container-monstres flex flex-col overflow-auto container-card-objet gap-4">
          <ul className="liste-monstres">
            {!chargement && monstresFiltres.length === 0 && <span className="monstre-nom">Aucun monstre trouvé.</span>}

            {monstresFiltres.map((m) => (
              <li key={m.id} className="monstre-card">
                <div className="monstre-img-wrapper">
                  <img src={m.imageUrl || "/images/default-monster.png"} alt={m.nom} className="monstre-img" />
                </div>

                <div className="monstre-info">
                  <span className="monstre-nom">{m.nom}</span>

                  <div className="monstre-stats">
                    <span>HP: {m.pointsDeVie}</span>
                    <span>Atk: {m.attaque}</span>
                    <span>Def: {m.defense}</span>
                  </div>

                  <div className="monstre-meta">
                    {m.typeMonstre && <span>Type : {formatTypeMonstre[m.typeMonstre]}</span>}
                    {m.grandeur && <span>Taille : {formatGrosseur[m.grandeur]}</span>}
                    {m.alignement && <span>Alignement : {formatAlignement[m.alignement]}</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </OverlayChargement>
    </div>
  );
}
