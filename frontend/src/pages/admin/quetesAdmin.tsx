import TitreBackground from "../../components/titreBackground"
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useMemo } from "react"
import { Navigate } from "react-router-dom";
import {api} from "../../api/backendApi";
import "../../css/quetesAdmin.css";

type Difficulte = 'FACILE' | 'MOYEN' | 'DIFFICILE' | 'LEGENDAIRE';

const DIFFICULTE = {
    FACILE: "FACILE",
    MOYEN: "MOYEN",
    DIFFICILE: "DIFFICILE",
    LEGENDAIRE: "LEGENDAIRE",
} as const;

interface Quete {
    id: string;
    nom: string;
    difficulte: Difficulte;
    description: string;
    recompense: number;
};

export default function QuetesAdmin() {
    const { estConnecte, estAdmin } = useAuth();
    const [listeQuetes, setListeQuetes] = useState<Quete[]>([]);
    const [queteSelection, setQueteSelection] = useState<Quete | null>(null);
    const [chargement, setChargement] = useState<boolean>(false);
    const [erreur, setErreur] = useState<string>("");
    const [erreurVisible, setErreurVisible] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [messageVisible, setMessageVisible] = useState<boolean>(false);
    const [messageModifier, setMessageModifier] = useState<string>("");
    const [messageModifierVisible, setMessageModifierVisible] = useState<boolean>(false);
    const [popupSuppressionOuvert, setPopupSuppressionOuvert] = useState<boolean>(false);
    const [suppressionEnCours, setSuppressionEnCours] = useState<boolean>(false);


    const [formDataAjout, setFormDataAjout] = useState({ //formData pour la création
        nom: "",
        difficulte: "FACILE",
        description: "",
        recompense: "",
    });
    const [formDataModifier, setFormDataModifier] = useState({
        id: "", //formData pour la modification
        nom: "",
        difficulte: "",
        description: "",
        recompense: "",
    });
    const listeQuetesTriee = useMemo(
        () => [...listeQuetes].sort((a,b) => a.nom.localeCompare(b.nom)), [listeQuetes] //permet au tri de se refaire uniquement si listeQuetes change
    );



    const handleChangeAjout = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> //permet à handleChange d'accepter ces trois types et couvrir l'ensemble du formulaire de création
    ) => {
            const {name, value} = e.target;
            setFormDataAjout((prev) => ({
                ...prev, 
                [name]: value,
            }));
    };

    const handleSubmitAjout = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const reponse = await api.post("/quete/creer", {
                ...formDataAjout,
                recompense: Number(formDataAjout.recompense), //cast en number pour la recompense
            });
            setMessage(reponse.data.message);
            setFormDataAjout({nom: "", difficulte: "FACILE", description: "", recompense: ""})
            recupererListeQuetes();
            
        } catch (err: any) {
            console.error("Erreur lors de l'ajout", err);
            const messageErreur = err.response?.data?.erreur
            setMessage(messageErreur);
        }
    }

    const formulaireAjoutEstValide = () => { //valide que le formulaire est rempli avant d'enable le bouton. Description est optionnelle.
        return(
            formDataAjout.nom.trim() !== "" &&
            formDataAjout.recompense.trim() !== ""
        );
    };

    const handleChangeModifier = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
            const {name, value} = e.target;
            setFormDataModifier((prev) => ({
                ...prev,
                [name]: value,
            }));
    };

    const handleSubmitModifier = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!queteSelection) return; //si aucune quête n'est sélectionnée on ne pourra pas submit

        try {
            const reponse = await api.patch(`/quete/${queteSelection.id}`, {
                ...formDataModifier,
                recompense: Number(formDataModifier.recompense),
            });
            setMessageModifier(reponse.data.message);
            setFormDataModifier({id: "", nom: "", difficulte: "", description: "", recompense: ""})
            recupererListeQuetes();
            setQueteSelection(null);
            
        } catch (err: any) {
            console.error("Erreur lors de la modification", err);
            const messageErreur = err.response?.data?.erreur
            setMessageModifier(messageErreur);
        }
    }

    const handleSelectionnerQuete = (quete: Quete) => {
        setQueteSelection(quete);
        setFormDataModifier({
            id: quete.id,
            nom: quete.nom,
            difficulte: quete.difficulte,
            description: quete.description,
            recompense: String(quete.recompense),
        })
    }

    const supprimerQuete = async () => {
        if (!queteSelection) return;
        try {
            setSuppressionEnCours(true);
            await api.delete(`/quete/supprimer/${queteSelection.id}`)
            setMessageModifier("La quête a été supprimée avec succès!");
            recupererListeQuetes();
            setFormDataModifier({id: "", nom: "", difficulte: "", description: "", recompense: ""})
            setQueteSelection(null);
        } catch (err:any) {
            console.error("Erreur lors de la suppression", err);
            setMessageModifier(err.response?.data?.erreur || "La quête n'a pas pu être supprimée");
            setPopupSuppressionOuvert(false);
        } finally {
            setSuppressionEnCours(false);
            setPopupSuppressionOuvert(false);
        }
    }

    const recupererListeQuetes = async () => {
        try {
            setChargement(true);
            const reponse = await api.get<Quete[]>("/quete");
            setListeQuetes(reponse.data);

        } catch (err: any) {
            console.error("Erreur API", err);
            setErreur("Erreur lors du chargement des quêtes.");
        } finally {
            setChargement(false);
        }
    }

    useEffect(() => {
        recupererListeQuetes();
    }, []);

    // les trois useEffect suivant permettent d'effacer les messages après 4 secondes
    useEffect(() => {
        if (message) {
            setMessageVisible(true);
            const timer = setTimeout(() => setMessageVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        if (messageModifier) {
            setMessageModifierVisible(true);
            const timer = setTimeout(() => setMessageModifierVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [messageModifier]);

    useEffect(() => {
        if (erreur) {
            setErreurVisible(true);
            const timer = setTimeout(() => setErreurVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [erreur]);

    if (!estConnecte || !estAdmin) {
        return <Navigate to="/connexion" replace />;
    }

    return (<>
    <div className="container-admin-quetes flex flex-col grow">
        <TitreBackground>Ajouter une quête</TitreBackground>
        <div className="container-ajout-quete flex flex-col container-style">

            <form onSubmit={handleSubmitAjout} className="form-container">
                <div className="container-ajout-champs flex space-x-8 justify-evenly shrink mb-8 mt-8">
                    <label htmlFor="nom">Nom:</label>
                    <input type="text" id="nom-ajout" name="nom" value={formDataAjout.nom} onChange={handleChangeAjout} required placeholder="Ex: Dératiser le champ"/>
                    <label htmlFor="difficulte">Difficulté:</label>
                    <select onChange={handleChangeAjout} value={formDataAjout.difficulte} name="difficulte" id="difficulte-ajout" required>
                        {Object.entries(DIFFICULTE).map(([key, value]) => (
                            <option key={key} value={value}>
                                {key.charAt(0) + key.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="recompense">Récompense:</label>
                    <input type="text" name="recompense" id="recompense-ajout" value={formDataAjout.recompense} onChange={handleChangeAjout} required placeholder="500" />
                </div>
                <div className="container-ajout-description flex flex-col mb-8">
                    <label htmlFor="description" className="ml-8">Description:</label>
                    <textarea name="description" id="description-ajout" rows={10} cols={50} value={formDataAjout.description} onChange={handleChangeAjout} placeholder="Le fermier vous demande..."></textarea>
                </div>
                <div className="container-ajout-bouton flex justify-end mr-8 mb-8">
                    <button className="btn-nav create disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale" disabled={!formulaireAjoutEstValide()} >Ajouter</button>
                </div>
            </form>
                <p className={`msg flex justify-center transition-opacity duration-300 ${messageVisible ? "opacity-100" : "opacity-0"}`}>
                    {message}
                </p>
        </div>




        <TitreBackground>Modifier une quête</TitreBackground>
        <div className="container-modif-quete container-style flex flex-col">

            <form className="modif-form-container" onSubmit={handleSubmitModifier}>
                <div className="container-modif-champs-liste flex">
                    <div className="container-modif-gauche flex flex-2 flex-col">
                        <div className="modif-nom flex">
                            <label htmlFor="nom">Nom:</label>
                            <input type="text" id="nom-modifier" name="nom" value={formDataModifier.nom} onChange={handleChangeModifier} required placeholder="Ex: Dératiser le champ"/>
                        </div>
                        <div className="modif-diff flex">
                            <label htmlFor="difficulte">Difficulte:</label>
                            <select onChange={handleChangeModifier} value={formDataModifier.difficulte} name="difficulte" id="difficulte-modifier" required>
                                {Object.entries(DIFFICULTE).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {key.charAt(0) + key.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>                        
                        <div className="modif-nom flex">
                            <label htmlFor="recompense">Récompense:</label>
                            <input type="text" id="recompense-modifier" name="recompense" value={formDataModifier.recompense} onChange={handleChangeModifier} required placeholder="500"/>
                        </div>
                        <div className="modif-description flex flex-col">
                            <label htmlFor="description">Description:</label>
                            <textarea name="description" id="description-modifier" rows={10} cols={25} value={formDataModifier.description} onChange={handleChangeModifier} placeholder="Le fermier vous demande..."></textarea>
                        </div>
                    </div>



                    <div className="container-modif-droite flex flex-1 inner-container m-8">
                        <ul className="w-full">
                            {erreur && (<span className={`msg flex justify-center transition-opacity duration-300 ${erreurVisible ? "opacity-100" : "opacity-0"}`}>{erreur}</span>)}
                            {!chargement && listeQuetes.length === 0 && (
                                <span className="perso-nom">Aucune quête à afficher.</span>
                            )}
                            {listeQuetesTriee.map((quete) => {
                                return (
                            <li key={quete.id} className="quetes-modif-list" onClick={() => handleSelectionnerQuete(quete)}>{quete.nom} [ {quete.difficulte} ]`</li>
                            )})}
                        </ul>
                    </div>
                </div>

                <div className="container-modif-boutons flex flex-start m-8">
                    <button className="btn-nav create disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale" disabled={!queteSelection}>Sauvegarder</button>
                    <button className="btn-nav delete disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale" type="button" onClick={() => queteSelection && setPopupSuppressionOuvert(true)} disabled={!queteSelection}>Supprimer</button>

                </div>
            </form>
                <p className={`msg flex justify-center transition-opacity duration-300 ${messageModifierVisible ? "opacity-100" : "opacity-0"}`}>
                    {messageModifier}
                </p>
        </div>
    </div>

    {popupSuppressionOuvert && (
        <div className="popup-overlay" onClick={() => setPopupSuppressionOuvert(false)}>
            <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
                <h2 className="mb-8">Suppression de la quête</h2>
                <p className="text-white">
                    Cette action est irréversible. La quête sera
                    définitivement supprimée pour tous. Voulez-vous continuer ?
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
                        onClick={supprimerQuete}
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