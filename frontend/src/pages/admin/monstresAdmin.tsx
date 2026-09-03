import TitreBackground from "../../components/titreBackground";
import { api } from "../../api/backendApi";
import { useEffect, useState } from "react";

import type { Monstre, ReponseListeMonstres, MonstreApi, ReponseListeMonstresApi } from "../../utils/interfaces";
import "../../css/monstresAdmin.css";
import { valeursGrosseur, valeursTypeMonstre, valeursAlignement, type Grandeur, type TypeMonstre, type Alignement } from "../../utils/types";

export default function MonstresAdmin() {
  const [rechercheMonstre, setRechercheMonstre] = useState("");
  const [resultatRecherche, setResultatRecherche] = useState<MonstreApi[]>([]);
  // const [erreur, setErreur] = useState<string>("");
  // const [chargement, setChargement] = useState<boolean>(true);
  const [listeMonstres, setListeMonstres] = useState<Monstre[]>([]);
  const [nomsMonstresBDD, setNomsMonstresBDD] = useState<Set<string>>(new Set());
  const [selectionMonstre, setSelectionMonstre] = useState<Monstre | null>(null);

  const recupererListeMonstres = async () => {
    try {
      // setChargement(true);
      // setErreur("");
      const reponse = await api.get<ReponseListeMonstres>("/monstres/");
      setListeMonstres(reponse.data.resultats);
    } catch {
      // setErreur("Erreur lors du chargement de la liste de monstres");
    } finally {
      // setChargement(false);
    }
  };

  const ajouterMonstre = async (index: string) => {
    try {
      await api.post(`/monstre/ajouter/${index}`);
      const res = await api.get("/monstres/");
      setListeMonstres(res.data.resultats);
    } catch (err: any) {
      console.error("Erreur API", err);
    }
  };

  const rechercheMonstres = async () => {
    try {
      // setChargement(true);
      // setErreur("");
      const reponse = await api.get<ReponseListeMonstresApi>(`/recherche/${rechercheMonstre}`);
      setResultatRecherche(reponse.data.resultats);
      console.log(resultatRecherche);
    } catch (err: any) {
      console.error("Erreur API", err);
      // setErreur("Erreur lors du chargement de la liste de monstres");
      // setChargement(false);
    }
  };

const Sauvegarder = async () => {
  if (!selectionMonstre) return;

  try {
    const { data } = await api.patch(`/monstre/${selectionMonstre.id}`, selectionMonstre);

    const monstreModifie = data.monstreModifie;

    setListeMonstres(prev =>
      prev.map(m => (m.id === monstreModifie.id ? monstreModifie : m))
    );

    setSelectionMonstre(monstreModifie);

    alert("Monstre sauvegardé !");
  } catch (e) {
    console.error(e);
    alert("Erreur lors de la sauvegarde");
  }
};

const Supprimer = async () => {
  if (!selectionMonstre) return;

  try {
    await api.delete(`/monstre/supprimer/${selectionMonstre.id}`)
    alert(`Monstre ${selectionMonstre.nom} Supprimé`)
    setListeMonstres(prev => prev.filter(m => m.id !== selectionMonstre.id))
    setSelectionMonstre(null);
  } catch (e) {
    console.error(e);
    alert(`Erreur lors de la suppression: ${e}`)
  }
}

  useEffect(() => {
    recupererListeMonstres();
  }, []);

  useEffect(() => {
    setNomsMonstresBDD(new Set(listeMonstres.map((m) => m.nom)));
  }, [listeMonstres]);


  return (
    <div className="container-admin-monstres flex flex-col grow">
      <h1 className="titre-admin-monstres text-center text-6xl font-bold w-full mx-auto text-white drop-shadow-[2px_2px_2px_#000]">Gestion des monstres</h1>

      <TitreBackground>Ajouter un monstre</TitreBackground>
      <div className="container-ajout-monstre flex flex-col container-style flex-grow">
        <form
          className="flex flex-col gap-4 w-full px-6 py-4 degrade-rouge rounded-md"
          onSubmit={(e) => {
            e.preventDefault();
            rechercheMonstres();
          }}
        >
          <span className="en-tete-objets">Recherche de monstre</span>

          <input type="text" id="monstre-recherche" name="nom-monstre" className="input-recherche w-full p-3 rounded-md bg-white/10 border border-white/20 text-white" placeholder="Rechercher un monstre..." value={rechercheMonstre} onChange={(e) => setRechercheMonstre(e.target.value.trim())} />
        </form>

        <div className="container-recherche-api container-style flex flex-col overflow-auto flex-grow">
          <ul className="liste-personnages flex flex-col ">
            {resultatRecherche.length === 0 && <span className="monstre-nom">Aucun Résultat.</span>}
            {resultatRecherche.map((m: MonstreApi) => {
              const existe = nomsMonstresBDD.has(m.name);

              return (
                <li key={m.index} className="liste-col-nom">
                  {/* je sais que ce nest pas securitaire, si jamais un fichier n'est pas nommé exactement comme le nom du monstre
                                    ou si il est deplacé cela causera un probleme, ceci est une solution temporaire */}
                  <span className="monstre-avatar justify-start">
                    <img src={`https://www.dnd5eapi.co/api/images/monsters/${m.name.toLowerCase().trim().replace(/\s+/g, "-")}.png`} className="image-monstre pl-10" />
                  </span>
                  <span className="monstre-nom">{m.name}</span>
                  <button
                    className="btn-ajouter"
                    disabled={existe}
                    onClick={() => {
                      ajouterMonstre(m.index);
                    }}
                  >
                    Ajouter
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <TitreBackground>Modifier un monstre</TitreBackground>

      <div className="container-modif-monstre container-style flex flex-col text-white">
        <form className="modif-form-container"
        
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="container-modif-champs-liste flex max-h-200">
            <div className={"container-modif-gauche min-w-0 flex flex-2 flex-col " + (!selectionMonstre ? "pointer-events-none opacity-50" : "")}>
              <div className="modif-nom flex flex-col mx-8">
                <label className="form-labels ml-8 mt-8 mb-4">Nom:</label>
                <input type="text" className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-white/20" 
                  value={selectionMonstre?.nom ?? ""}
                  onChange={(e)=>setSelectionMonstre((prev) => prev ? {...prev, nom: e.target.value}: prev)}
                  />
              </div>

              <div className="modif-pointsDeVie flex flex-col mx-8 mt-4">
                <label className="form-labels mb-2">Points de vie:</label>
                <input type="number" className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-white/20"
                value={selectionMonstre?.pointsDeVie ?? ""}
                onChange={(e)=>setSelectionMonstre((prev) => prev ? {...prev, pointsDeVie: Number(e.target.value)}: prev)}
                />
              </div>

              <div className="modif-attaque flex flex-col mx-8 mt-4">
                <label className="form-labels mb-2">Attaque:</label>
                <input type="number" className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-white/20"
                value={selectionMonstre?.attaque ?? ""}
                onChange={(e)=>setSelectionMonstre((prev) => prev ? {...prev, attaque: Number(e.target.value)}: prev)}
                />
              </div>

              <div className="modif-defense flex flex-col mx-8 mt-4">
                <label className="form-labels mb-2">Défense:</label>
                <input type="number" className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-white/20"
                value={selectionMonstre?.defense ?? ""}
                onChange={(e)=>setSelectionMonstre((prev) => prev ? {...prev, defense: Number(e.target.value)}: prev)}
                />
              </div>

              <div className="modif-type-monstre flex gap-1 flex-col max-w-50 mt-6">
                <label className="form-labels ml-8 mb-2">Type:</label>
                <select className="ml-8 inline-flex w-full rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white outline outline-white/20" 
                  value={selectionMonstre?.typeMonstre ?? ""} 
                  onChange={(e)=>setSelectionMonstre((prev) => prev ? {...prev, typeMonstre: e.target.value as TypeMonstre}: prev)}
                >
                  {valeursTypeMonstre.map((t) => (
                    <option key={t} value={t} className="text-black">
                      {t}
                    </option>
                  ))}
                  value
                </select>
              </div>

              <div className="modif-grandeur flex gap-1 flex-col max-w-50 mt-6">
                <label className="form-labels ml-8 mb-2">Grosseur:</label>
                <select className="ml-8 inline-flex w-full rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white outline outline-white/20"
                  value={selectionMonstre?.grandeur ?? ""} 
                  onChange={(e)=>setSelectionMonstre((prev) => prev ? {...prev, grandeur: e.target.value as Grandeur}: prev)}
                >
                  {valeursGrosseur.map((g) => (
                    <option key={g} value={g} className="text-black">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modif-alignement flex gap-1 flex-col max-w-50 mt-6">
                <label className="form-labels ml-8 mb-2">Alignement:</label>
                <select className="ml-8 inline-flex w-full rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white outline outline-white/20"
                  value={selectionMonstre?.alignement ?? ""} 
                  onChange={(e)=>setSelectionMonstre((prev) => prev ? {...prev, alignement: e.target.value as Alignement}: prev)}
                >
                  {valeursAlignement.map((a) => (
                    <option key={a} value={a} className="text-black">
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modif-image-url flex flex-row items-center gap-4 mx-8 mt-6 mb-8">
                <div className="flex flex-col flex-1">
                <label className="form-labels mb-2">Image URL:</label>
                <input type="text" className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline outline-white/20" 
                value={selectionMonstre?.imageUrl ?? ""}
                onChange={(e)=>setSelectionMonstre((prev) => prev ? {...prev, imageUrl: e.target.value}: prev)}
                />
                </div>
                <img className="modification-thumbnail max-w-20 max-h-20 object-contain rounded-md" src={selectionMonstre?.imageUrl ?? ""} alt="" />
              </div>

            </div>

            <div className="container-modif-droite flex flex-1 inner-container m-8 min-w-0">
              <ul className="w-full liste-monstres flex flex-col">
                {listeMonstres.map((m) => (
                  <li key={m.id} className={"monstre-modif-list" + (selectionMonstre?.id === m.id ? "selected" : "")} onClick={() => m.id === selectionMonstre?.id ? setSelectionMonstre(null): setSelectionMonstre(m)}>
                    {m.nom}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="container-modif-boutons flex flex-start m-8 mt-20">
            <button className="btn-nav create disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale"
              type="button"
              disabled={!selectionMonstre}
              onClick={Sauvegarder}
            >
              Sauvegarder</button>

            <button className="btn-nav delete disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale" 
              type="button"
              disabled={!selectionMonstre}
              onClick={Supprimer}
            >
              Supprimer
            </button>
          </div>
        </form>

        <p className="msg flex justify-center opacity-0">Message ici</p>
      </div>
    </div>
  );
}
