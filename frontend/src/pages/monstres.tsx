import TitreBackground from "../components/titreBackground";
import { useState, useEffect } from "react";
import { api } from "../api/backendApi";
import "../css/monstres.css";
import { useAuth } from "../context/AuthContext";
import OverlayChargement from "../components/overlayChargement";
import { formatAlignement, formatTypeMonstre, formatGrosseur } from "../utils/formatMonstres";
import type { Monstre, ReponseListeMonstres, ReponseUtilisateur } from "../utils/interfaces";
import {
  valeursGrosseur,
  valeursTypeMonstre,
  valeursAlignement,
  type TypeGrosseur,
  type TypeMonstre,
  type Alignement
} from "../utils/types";

export default function Monstres() {
  const [listeMonstres, setListeMonstres] = useState<Monstre[]>([]);
  const [erreur, setErreur] = useState<string>("");
  const [chargement, setChargement] = useState<boolean>(true);
  const { estConnecte } = useAuth();
  const [avatarUtilisateur, setAvatarUtilisateur] = useState<string>("https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png");
  const [nomUtilisateur, setNomUtilisateur] = useState<string>("");

  const [filtreNom, setFiltreNom] = useState<string>("");
  const [filtreGrandeur, setFiltreGrandeur] = useState<TypeGrosseur | null>(null);
  const [filtreType, setFiltreType] = useState<TypeMonstre | null>(null);
  const [filtreAlignement, setFiltreAlignement] = useState<Alignement | null>(null);

  const recupererInfosUtilisateur = async () => {
    try {
      setErreur("");
      const reponse = await api.get<ReponseUtilisateur>("/auth/me");
      setNomUtilisateur(reponse.data.pseudo);
      setAvatarUtilisateur(reponse.data.avatarUrl);
    } catch {
      setErreur("Erreur lors du chargement du compte");
    }
  };

  const recupererListeMonstres = async () => {
    try {
      setChargement(true);
      setErreur("");
      const reponse = await api.get<ReponseListeMonstres>("/monstres/");
      setListeMonstres(reponse.data.resultats);
    } catch {
      setErreur("Erreur lors du chargement de la liste de monstres");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    recupererListeMonstres();
    recupererInfosUtilisateur();
  }, []);

  const monstresFiltres = listeMonstres.filter((m) => {
    if (filtreNom && !m.nom.toLowerCase().includes(filtreNom.toLowerCase())) return false;
    if (filtreGrandeur && m.grandeur !== filtreGrandeur) return false;
    if (filtreType && m.typeMonstre !== filtreType) return false;
    if (filtreAlignement && m.alignement !== filtreAlignement) return false;
    return true;
  });

  return (
    <div className="container-compte flex flex-col grow">
      <OverlayChargement chargement={chargement} texte="Chargement des monstres...">

        {estConnecte && (
          <div className="container-utilisateur flex justify-center gap-12">
            <div className="user-avatar">
              <img src={avatarUtilisateur} alt="avatar" />
            </div>
            <div className="container-nom-suppr flex flex-col">
              <h2 className="user-nom m-1">{nomUtilisateur}</h2>
            </div>
          </div>
        )}

        <TitreBackground>Monstres</TitreBackground>

        <div className="intro-monstres flex flex-col items-center text-center p-6 mb-6">
          <p className="intro-texte">
            Voici les monstres qui peuplent les terres de MaxRemi. Certains sont hostiles,
            d’autres simplement mystérieux. Leur puissance varie selon leur nature et leur
            alignement. Explore leur fiche pour mieux comprendre les dangers du royaume.
          </p>
        </div>

 <div className="w-full flex justify-center mt-6 mb-10">
  <div className="w-full max-w-4xl bg-[#1e1e1e] border border-white/20 rounded-xl p-6 shadow-xl">

    <h3 className="text-xl font-bold mb-4 text-center tracking-wide">
      Recherche et tri
    </h3>

    <div className="flex flex-col gap-4">

      <input
        type="text"
        className="input-recherche w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
        placeholder="Recherche nom"
        value={filtreNom}
        onChange={(e) => setFiltreNom(e.target.value)}
      />

      <div className="flex flex-wrap gap-4 justify-center">

        <select
          className="select-recherche p-3 rounded-lg bg-white/10 border border-white/20 text-white"
          value={filtreGrandeur ?? ""}
          onChange={(e) => setFiltreGrandeur(e.target.value ? (e.target.value as TypeGrosseur) : null)}
        >
          <option value="">Grandeur</option>
          {valeursGrosseur.map((g) => (
            <option key={g} value={g}>{formatGrosseur[g]}</option>
          ))}
        </select>

        <select
          className="select-recherche p-3 rounded-lg bg-white/10 border border-white/20 text-white"
          value={filtreType ?? ""}
          onChange={(e) => setFiltreType(e.target.value ? (e.target.value as TypeMonstre) : null)}
        >
          <option value="">Type</option>
          {valeursTypeMonstre.map((t) => (
            <option key={t} value={t}>{formatTypeMonstre[t]}</option>
          ))}
        </select>

        <select
          className="select-recherche p-3 rounded-lg bg-white/10 border border-white/20 text-white"
          value={filtreAlignement ?? ""}
          onChange={(e) => setFiltreAlignement(e.target.value ? (e.target.value as Alignement) : null)}
        >
          <option value="">Alignement</option>
          {valeursAlignement.map((a) => (
            <option key={a} value={a}>{formatAlignement[a]}</option>
          ))}
        </select>

      </div>
    </div>

  </div>
</div>


        <div className="container-monstres flex flex-col overflow-auto">
          <ul className="liste-monstres">
            {!chargement && monstresFiltres.length === 0 && (
              <span className="monstre-nom">Aucun monstre trouvé.</span>
            )}

            {monstresFiltres.map((m) => (
              <li key={m.id} className="monstre-card">
                <div className="monstre-img-wrapper">
                  <img
                    src={m.imageUrl || "/images/default-monster.png"}
                    alt={m.nom}
                    className="monstre-img"
                  />
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
