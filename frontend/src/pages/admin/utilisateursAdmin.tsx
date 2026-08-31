import TitreBackground from "../../components/titreBackground"
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom";
import {api} from "../../api/backendApi";
import "../../css/utilisateursAdmin.css";

interface Utilisateur {
    id: string;
    email: string;
    pseudo: string;
    mdp: string;
    avatarUrl: string;
};

export default function UtilisateursAdmin() {
    const { estConnecte, estAdmin } = useAuth();
    const [message, setMessage] = useState<string>("");
    const [messageVisible, setMessageVisible] = useState<boolean>(false);
    const [popupSuppressionOuvert, setPopupSuppressionOuvert] = useState<boolean>(false);
    const [suppressionEnCours, setSuppressionEnCours] = useState<boolean>(false);
    const [utilisateurSelection, setUtilisateurSelection] = useState<Utilisateur | null>(null);
    const [rechercheValeur, setRechercheValeur] = useState<string>("");
    const [avatarUtilisateur, setAvatarUtilisateur] = useState<string>("https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png")
    const [formDataModifier, setFormDataModifier] = useState({
        mdp: "",
    });


    const handleSubmitRecherche = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const params = new URLSearchParams();
            params.append("recherche", rechercheValeur);

            const reponse = await api.get(`/utilisateur/recuperer?${params.toString()}`);

            setAvatarUtilisateur(reponse.data.utilisateur.avatarUrl || "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png")
            setUtilisateurSelection(reponse.data.utilisateur);
            setMessage(reponse.data.message);
            
        } catch (err: any) {
            console.error("Erreur lors de la recherche", err);
            const messageErreur = err.response?.data?.erreur
            setMessage(messageErreur);
        }
    }


    const formulaireEstValide = () => { //valide que le formulaire est rempli avant d'enable le bouton.
        return(
            rechercheValeur !== ""
        );
    };

    const handleChangeModifier = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
            const {name, value} = e.target;
            setFormDataModifier((prev) => ({
                ...prev,
                [name]: value,
            }));
    };

    const handleSubmitModifier = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!utilisateurSelection) return; //si aucun utilisateur n'est sélectionnée on ne pourra pas submit

        try {
            const reponse = await api.patch(`/utilisateur/modifier/${utilisateurSelection.id}`, {
                ...formDataModifier,
            });
            setMessage(reponse.data.message);
            setFormDataModifier({
                mdp: "",
            })
            setRechercheValeur("");
            
        } catch (err: any) {
            console.error("Erreur lors de la modification", err);
            const messageErreur = err.response?.data?.erreur
            setMessage(messageErreur);
        }
    }

    const supprimerUtilisateur = async () => {
        if (!utilisateurSelection) return;
        try {
            setSuppressionEnCours(true);
            await api.delete(`/utilisateur/supprimer/${utilisateurSelection.id}`)
            setMessage("L'utilisateur a été supprimé avec succès!");
            setFormDataModifier({
                mdp: "",
            })
            setRechercheValeur("");
            setUtilisateurSelection(null);
            setAvatarUtilisateur("https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png")
        } catch (err:any) {
            console.error("Erreur lors de la suppression", err);
            setMessage(err.response?.data?.erreur || "L'utilisateur n'a pas pu être supprimé");
            setPopupSuppressionOuvert(false);
        } finally {
            setSuppressionEnCours(false);
            setPopupSuppressionOuvert(false);
        }
    }

    useEffect(() => {
        const verifierAcces = async () => {
            try { 
                await api.get("auth/me");
            } catch (err) {
            }
        };
        verifierAcces();
    }, []);

    // le use effect permet d'effacer les messages après 4 secondes
    useEffect(() => {
        if (message) {
            setMessageVisible(true);
            const timer = setTimeout(() => {
                setMessageVisible(false),
                setMessage("");}, 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!estConnecte || !estAdmin) {
        return <Navigate to="/connexion" replace />;
    }


    return (<>
    <div className="container-admin-objets flex flex-col grow">
        <TitreBackground>Gestion des utilisateurs:</TitreBackground>
        <div className="container-utilisateurs  flex flex-col w-full container-style text-white">
            
            <div className="container-recherche-row flex">

                <div className="container-recherche-form flex-1 flex flex-col">
                    <form onSubmit={handleSubmitRecherche} className="form-recherche flex flex-col gap-1 mx-8 mt-8">
                        <div className="flex flex-col gap-1 flex-2 col-span-2">
                            <label htmlFor="nom" className="form-labels">
                                Recherche par pseudo, email ou ID:
                            </label>
                            <input type="text" id="recherche" name="recherche" value={rechercheValeur} onChange={(e) => setRechercheValeur(e.target.value)} className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base 
                            text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                            required placeholder="Ex: Bobby OU bobby@mail.com OU 25d05..."/>
                        </div>
                        <div className="container-bouton-recherche flex justify-start mr-8 my-8">
                            <button className="btn-nav create disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale" disabled={!formulaireEstValide()} >
                                Rechercher
                            </button>
                        </div>
                    </form>

                </div>

                <div className="container-recherche-resultat flex flex-col md:flex-row flex-2 mx-8 justify-center gap-12 items-center">
                    <div className="user-avatar min-w-20"><img src={avatarUtilisateur} alt="avatar" /></div>
                    <div className="container-nom-email flex flex-col">
                        <h2 className="user-nom m-1">{utilisateurSelection?.pseudo}</h2>
                        <h3 className="user-nom m-1">{utilisateurSelection?.email}</h3>
                    </div>
                </div>

            </div>

            <form onSubmit={handleSubmitModifier} className="form-recherche flex flex-col gap-1">
                <div className="container-champ-modif flex gap-1 mx-8 mt-8">
                    <div className="changement-mdp flex flex-col gap-1 col-span-2">
                        <label htmlFor="mdp" className="text-2xl form-labels truncate text-ellipsis">
                            Nouveau mot de passe:
                        </label>
                        <input type="password" id="mdp" name="mdp" value={formDataModifier.mdp} onChange={handleChangeModifier} className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base 
                    text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale"
                    disabled={!utilisateurSelection}
                    required
                    placeholder="Nouveau mot de passe"/>
                    </div>
                </div>


                <div className="container-boutons-modif flex flex-start m-8">
                    <button className="btn-nav create disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale" disabled={!utilisateurSelection || formDataModifier.mdp === ""}>
                        Modifier
                    </button>
                    <button className="btn-nav delete disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale"
                    type="button" onClick={() => utilisateurSelection && setPopupSuppressionOuvert(true)} disabled={!utilisateurSelection}>
                        Supprimer le compte
                    </button>
                </div>
            </form>

            <div className="container-msg flex justify-center">
                <p className={`msg flex justify-center transition-opacity duration-300 ${messageVisible ? "opacity-100" : "opacity-0"}`}>
                    {message}
                </p>
            </div>
        </div>
    </div>

    {popupSuppressionOuvert && (
        <div className="popup-overlay" onClick={() => setPopupSuppressionOuvert(false)}>
            <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
                <h2 className="mb-8">Suppression de l'utilisateur</h2>
                <p className="text-white">
                    Cette action est irréversible. L'utilisateur sera
                    définitivement supprimé. Voulez-vous continuer ?
                </p>
                <div className="popup-actions flex gap-4 justify-center mt-8">
                    <button
                        type="button"
                        className="flex w-full justify-center items-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-2
                        focus-visible:outline-offset-2 focus-visible:outline-indigo-500 "
                        onClick={() => setPopupSuppressionOuvert(false)}
                        disabled={suppressionEnCours}
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        className="flex w-full justify-center items-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-2
                        focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        onClick={supprimerUtilisateur}
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
