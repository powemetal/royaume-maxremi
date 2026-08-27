import TitreBackground from "../components/titreBackground";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/backendApi";
import "../css/monstres.css";

interface Monstre {
    id: string;
    nom: string;
    imageUrl: string;
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
                <ul className="liste-monstres flex flex-col ">
                    {!chargement && listeMonstres.length === 0 && (
                    <span className="monstre-nom">Le serveur ne contient aucun monstre.</span>
                )}
                {listeMonstres.map((m:Monstre) => {
                    return (
                        // onClick={() => ouvrirPageMonstre(p.id)}
                    <li key={m.id} className="liste-col-nom" > 
                        <span className="monstre-avatar justify-start"><img src={m.imageUrl} /></span>
                        <span className="monstre-nom">{m.nom}</span>
                        {/* <span className="monstre-attaque">{m.attaque}</span> */}
                    </li>  
                    )
                })}
            </ul>

        </div>
        </div>
    )

}