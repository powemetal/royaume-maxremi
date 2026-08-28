import TitreBackground from "../components/titreBackground";
import { useState, useEffect } from "react";
import { api } from "../api/backendApi";
import "../css/monstres.css";
import { useAuth } from "../context/AuthContext";
import OverlayChargement from "../components/overlayChargement";

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

interface ReponseUtilisateur {
        id: string;
        pseudo: string;
        avatarUrl: string;
    };

export default function Monstres() {

    
    
    
    
    const [listeMonstres, setListeMonstres] = useState<Monstre[]>([]);
    const [erreur, setErreur] = useState<string>("");
    const [chargement, setChargement] = useState<boolean>(true)
    const { estConnecte } = useAuth();
    const [avatarUtilisateur, setAvatarUtilisateur] = useState<string>("https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png")
    const [nomUtilisateur, setNomUtilisateur] = useState<string>("");
    
    

    const recupererInfosUtilisateur = async () => {
        try{
            setErreur("");
            const reponse = await api.get<ReponseUtilisateur>("/auth/me");
            setNomUtilisateur(reponse.data.pseudo);
            setAvatarUtilisateur(reponse.data.avatarUrl);
        } catch (err: any) {
            console.error("Erreur API", err);
            setErreur("Erreur lors du chargement du compte")
        }
    }


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
        recupererInfosUtilisateur();
    }, []);

return (
    <div className="container-compte flex flex-col grow">

        <OverlayChargement chargement={chargement} texte="Chargement des monstres...">

            {estConnecte && (
                <div className="container-utilisateur flex justify-center gap-12">
                    
                        <>
                            <div className="user-avatar">
                                <img src={avatarUtilisateur} alt="avatar" />
                            </div>
                            <div className="container-nom-suppr flex flex-col">
                                <h2 className="user-nom m-1">{nomUtilisateur}</h2>
                            </div>
                        </>
                    
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


            <div className="container-monstres container-style flex flex-col overflow-auto">
                <ul className="liste-monstres">
                    {!chargement && listeMonstres.length === 0 && (
                        <span className="monstre-nom">Le serveur ne contient aucun monstre.</span>
                    )}

                    {listeMonstres.map((m: Monstre) => (
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
                    ))}
                </ul>
            </div>

        </OverlayChargement>

    </div>
);


}