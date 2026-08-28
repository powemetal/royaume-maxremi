// A FAIRE :
// Link la bonne page pour la création de personnages

import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/compte.css";
import TitreBackground from "../components/titreBackground";
import { api } from "../api/backendApi";

interface Personnage {
    id: string;
    nom: string;
    niveau: number;
    avatarUrl: string;
}

interface ReponseListePersonnages {
    message: string;
    data: {
        listePersonnages: Personnage[];
    }
}

interface ReponseUtilisateur {
        id: string;
        pseudo: string;
        avatarUrl: string;
    };



export default function Compte() {

    const { estConnecte, seDeconnecter } = useAuth();
    const [nomUtilisateur, setNomUtilisateur] = useState<string>("");
    const [listePerso, setListePerso] = useState<Personnage[]>([]);
    const [erreur, setErreur] = useState<string>("");
    const [chargement, setChargement] = useState<boolean>(true)
    const [avatarUtilisateur, setAvatarUtilisateur] = useState<string>("https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png")
    const navigate = useNavigate();
    const [popupSuppressionOuvert, setPopupSuppressionOuvert] = useState<boolean>(false);
    const [suppressionEnCours, setSuppressionEnCours] = useState<boolean>(false);


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

    const recupererListePerso = async () => {
        try{
            setChargement(true);
            setErreur("");
            const reponse = await api.get<ReponseListePersonnages>("/personnage/recuperer/liste-personnages");
            setListePerso(reponse.data.data.listePersonnages);
        } catch (err: any) {
            console.error("Erreur API", err);
            setErreur("Erreur lors du chargement de la liste de personnages");
        } finally {
            setChargement(false);
        }
    }

    const supprimerCompte = async () => {
        try {
            setSuppressionEnCours(true);
            await api.delete("/auth/me");
            seDeconnecter();
        } catch (err:any) {
            console.error("Erreur API", err);
            setErreur("Erreur lors de la suppression du compte");
            setPopupSuppressionOuvert(false);
        } finally {
            setSuppressionEnCours(false);
        }
    }

    useEffect(() => {
        recupererListePerso();
    }, [estConnecte]);

    useEffect(() => {
        recupererInfosUtilisateur();
    }, [estConnecte]);

    const ouvrirPagePersonnage = (id: string) => {
        navigate(`/personnage/recuperer/${id}`);
    };



  if (!estConnecte) {
    return <Navigate to="/connexion" replace />;
  }
    return (<>
    
    <div className="container-compte flex flex-col grow">
        <div className="container-utilisateur flex justify-center gap-12">
            {estConnecte && (<>
            <div className="user-avatar"><img src={avatarUtilisateur} alt="avatar" /></div>
            <div className="container-nom-suppr flex flex-col">
                    <h2 className="user-nom m-1">{nomUtilisateur}</h2>
                    <button type="button" onClick={()=> setPopupSuppressionOuvert(true)} className="btn-nav delete m-1">
                        Supprimer mon compte
                    </button>
                    <Link to={"/creerperso"} className="btn-nav create m-1">
                        Créer un personnage
                    </Link>
            </div>
            </>)}
        </div>

        <TitreBackground>Personnages</TitreBackground>
        <div className="container-personnages container-style flex flex-col overflow-auto" >
            <ul className="liste-personnages flex flex-col ">
                {!chargement && listePerso.length === 0 && (
                    <span className="perso-nom">Vous n'avez aucun personnage.</span>
                )}
                {listePerso.map((p:Personnage) => {
                    return (
                    <li key={p.id} className="liste-col-nom" onClick={() => ouvrirPagePersonnage(p.id)}>
                        <span className="perso-avatar justify-start"><img src={p.avatarUrl} /></span>
                        <span className="perso-nom">{p.nom}</span>
                        <span className="perso-lvl">{p.niveau}</span>
                    </li>  
                    )
                })}
            </ul>

        </div>
    </div>
    

    {popupSuppressionOuvert && (
        <div className="popup-overlay" onClick={() => setPopupSuppressionOuvert(false)}>
            <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
                <h2 className="mb-8">Suppression de votre compte</h2>
                <p className="text-white">
                    Cette action est irréversible. Tous vos personnages seront
                    définitivement supprimés. Voulez-vous continuer ?
                </p>
                <div className="popup-actions flex gap-4 justify-center mt-8">
                    <button
                        type="button"
                        className="flex w-full justify-center items-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 "
                        onClick={() => setPopupSuppressionOuvert(false)}
                        disabled={suppressionEnCours}
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        className="flex w-full justify-center items-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        onClick={supprimerCompte}
                        disabled={suppressionEnCours}
                    >
                        {suppressionEnCours ? "Suppression..." : "Confirmer la suppression"}
                    </button>
                </div>
            </div>
        </div>
    )}

    </>)
}