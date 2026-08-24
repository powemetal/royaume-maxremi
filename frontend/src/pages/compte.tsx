import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/compte.css";
import TitreBackground from "../components/titreBackground";
import { api } from "../api/backendApi";

interface Personnage {
    id: string;
    nom: string;
    niveau: number;
    avatar: string;
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
    };


export default function Compte() {

    const { estConnecte } = useAuth();
    const [nomUtilisateur, setNomUtilisateur] = useState<string>("");
    const [idCompte, setIdCompte] = useState<string>("");
    const [idPerso, setIdPerso] = useState<string>("");
    const [listePerso, setListePerso] = useState<Personnage[]>([]);
    const [erreur, setErreur] = useState<string>("");
    const [chargement, setChargement] = useState<boolean>(true)


// what to do:
// aller cherche le nom utilisateur et l'afficher
// aller chercher la liste des persos et l'Afficher
// clique sur un perso ouvre sa page
// clique sur supprimer mon compte ouvre un popup de confirmation
// clique sur creer un perso ouvre la page de création de perso

    const recupererNomUtilisateur = async () => {
        try{
            setErreur("");
            const reponse = await api.get<ReponseUtilisateur>("/auth/me");
            setIdCompte(reponse.data.id);
            setNomUtilisateur(reponse.data.pseudo);
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

    useEffect(() => {
        recupererListePerso();
    }, [estConnecte]);

    useEffect(() => {
        recupererNomUtilisateur();
    }, [estConnecte]);

    


  if (!estConnecte) {
    return <Navigate to="/connexion" replace />;
  }
    return (<>
    
    <div className="container-compte flex flex-col grow">
        <div className="container-utilisateur flex justify-center gap-12">
            <div className="user-avatar"><img src="\src\assets\images\avatars\RMR02.jpeg" alt="avatar" /></div>
            <div className="container-nom-suppr flex flex-col">
                    {nomUtilisateur && (<h2 className="user-nom m-1">{nomUtilisateur}</h2>)}
                    <Link to={"/supprimercompte"} className="btn-nav delete m-1">
                        Supprimer mon compte
                    </Link>
                    <Link to={"/creerperso"} className="btn-nav create m-1">
                        Créer un personnage
                    </Link>

            </div>

        </div>
        <TitreBackground>Personnages</TitreBackground>
        <div className="container-personnages container-style flex flex-col overflow-auto" >
            <ul className="liste-personnages flex flex-col ">
                <li className="liste-col-nom">
                    <span className="perso-avatar justify-start"><img src="\src\assets\images\avatars\RMR04.jpeg" alt="avatar" /></span>
                    <span className="perso-nom">RyanFurrrrrry</span>
                    <span className="perso-lvl">Niv. 21</span>
                </li>
                <li className="liste-col-nom ">
                    <span className="perso-avatar justify-start"><img src="\src\assets\images\avatars\RMR03.jpeg" alt="avatar" /></span>
                    <span className="perso-nom">KungFuCharles</span>
                    <span className="perso-lvl">Niv. 11</span>
                </li>
                <li className="liste-col-nom">
                    <span className="perso-avatar justify-start"><img src="\src\assets\images\avatars\RMR05.jpeg" alt="avatar" /></span>
                    <span className="perso-nom">Bin Bao 360</span>
                    <span className="perso-lvl">Niv. 55</span>
                </li>
                <li className="liste-col-nom ">
                    <span className="perso-avatar justify-start"><img src="\src\assets\images\avatars\RMR08.jpeg" alt="avatar" /></span>
                    <span className="perso-nom">El cucumbeR</span>
                    <span className="perso-lvl">Niv. 15</span>
                </li>
                <li className="liste-col-nom">
                    <span className="perso-avatar justify-start"><img src="\src\assets\images\avatars\RMR10.jpeg" alt="avatar" /></span>
                    <span className="perso-nom">RanTannn</span>
                    <span className="perso-lvl">Niv. 5</span>
                </li>
                <li className="liste-col-nom">
                    <span className="perso-avatar justify-start"><img src="\src\assets\images\avatars\RMR10.jpeg" alt="avatar" /></span>
                    <span className="perso-nom">RanTannn</span>
                    <span className="perso-lvl">Niv. 5</span>
                </li>
                <li className="liste-col-nom">
                    <span className="perso-avatar justify-start"><img src="\src\assets\images\avatars\RMR10.jpeg" alt="avatar" /></span>
                    <span className="perso-nom">RanTannn</span>
                    <span className="perso-lvl">Niv. 5</span>
                </li>


            </ul>

        </div>
    </div>
    
    
    </>)
}