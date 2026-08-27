import TitreBackground from "../components/titreBackground";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/backendApi";
import "../css/monstres.css";

interface Monstre {
    id: string;
    nom: string;
    pointsDeVie: number;
    attaque: number;
    defense: number;
    typeMonstre: string | null;
    grandeur: string | null;
    alignement: string | null;
    imageUrl: string | null;
}


interface ReponseListeMonstres {
    message: string;
    data: {
        listeMonstres: Monstre[];
    }
}


export default function Monstres() {

    
    
    
    
    const [listeMonstres, setListeMonstres] = useState<Monstre[]>([]);
    const [erreur, setErreur] = useState<string>("");
    const [chargement, setChargement] = useState<boolean>(true)
    
    const navigate = useNavigate();
    
    

    const recupererListeMonstres = async () => {
        try{
            setChargement(true);
            setErreur("");
            const reponse = await api.get<ReponseListeMonstres>("/monstres/");
            setListeMonstres(reponse.data.data.listeMonstres);
        } catch (err: any) {
            console.error("Erreur API", err);
            setErreur("Erreur lors du chargement de la liste de monstres");
        } finally {
            setChargement(false);
        }
    }


    useEffect(() => {
        recupererListeMonstres();
    }, []);

    return (
        <div>
            <TitreBackground>Monstres</TitreBackground>
            <div className="container-monstres container-style flex flex-col overflow-auto ml-25" >
                <ul className="liste-monstres flex flex-col">
                    {!chargement && listeMonstres.length === 0 && (
                        <span className="monstre-nom">Le serveur ne contient aucun monstre.</span>
                    )}

                    {listeMonstres.map((m: Monstre) => {
                        return (
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
                                        {m.typeMonstre && <span>Type : {m.typeMonstre}</span>}
                                        {m.grandeur && <span>Taille : {m.grandeur}</span>}
                                        {m.alignement && <span>Alignement : {m.alignement}</span>}
                                    </div>
                                </div>

                            </li>
                        )
                    })}
                </ul>




        </div>
        </div>
    )

}