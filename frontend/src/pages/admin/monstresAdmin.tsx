import TitreBackground from "../../components/titreBackground";
import {api} from "../../api/backendApi";
import { useState } from "react";
import { formatAlignement, formatTypeMonstre, formatGrosseur} from "../../utils/formatMonstres"
import type { Monstre, ReponseListeMonstres, ReponseUtilisateur, MonstreApi, ReponseListeMonstresApi} from "../../utils/interfaces"
import "../../css/monstresAdmin.css";


export default function MonstresAdmin() {
    const [rechercheMonstre, setRechercheMonstre] = useState("")
    const [resultatRecherche, setResultatRecherche] = useState<MonstreApi[]>([]);

    const ajouterMonstre = async (index : string) => {
        try {
            const ajout = await api.post(`/monstre/ajouter/${index}`)
        } catch (err:any) {
            console.error("Erreur API", err)
        }
        
    }




    const rechercheMonstres = async () => {
        try{
            // setChargement(true);
            // setErreur("");
            const reponse = await api.get<ReponseListeMonstresApi>(`/recherche/${rechercheMonstre}`);
            setResultatRecherche(reponse.data.resultats);
            console.log(resultatRecherche)
            } catch (err: any) {
            console.error("Erreur API", err);
            // setErreur("Erreur lors du chargement de la liste de monstres");
            // setChargement(false);
        }

    }

    return(

        <div className="container-admin-monstres flex flex-col grow">
            <h1 className="titre-admin-monstres text-center text-6xl font-bold w-full mx-auto text-white drop-shadow-[2px_2px_2px_#000]">Gestion des monstres</h1>

            <TitreBackground>Ajouter un monstre</TitreBackground>
            <div className="container-ajout-monstre flex flex-col container-style">
                <form className="form-recheche-monstes" onSubmit={ (e) => {e.preventDefault(); rechercheMonstres();}}>
                    <div>
                        <label>Recherche de monstre:</label>
                        <input 
                            type="text" 
                            id="monstre-recherche" 
                            name="nom-monstre" 
                            value={rechercheMonstre} 
                            onChange={(e) => {setRechercheMonstre(e.target.value.trim())}}
                        />
                    </div>
                </form>

                <div className="container-monstres container-style flex flex-col overflow-auto">
                    <ul className="liste-personnages flex flex-col ">
                        {resultatRecherche.length === 0 && (
                            <span className="monstre-nom">Aucun Résultat.</span>
                        )}
                        {resultatRecherche.map((m:MonstreApi) => {
                            return (
                                <li key={m.index} className="liste-col-nom">
                                    {/* je sais que ce nest pas securitaire, si jamais un fichier n'est pas nommé exactement comme le nom du monstre
                                    ou si il est deplacé cela causera un probleme, ceci est une solution temporaire */}
                                    <span className="monstre-avatar justify-start"><img src={`https://www.dnd5eapi.co/api/images/monsters/${m.name.toLowerCase().trim().replace(/\s+/g, "-")}.png`} className="image-monstre pl-10"/></span>
                                    <span className="monstre-nom">{m.name}</span>
                                    <button className="btn-ajouter" onClick={() => {ajouterMonstre(m.index)}}>Ajouter</button>
                                </li>  
                            )
                        })}
                        
                    </ul>
                </div>
            </div>
        </div>

    )
}