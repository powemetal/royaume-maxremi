import { Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import TitreBackground from "../../components/titreBackground"
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useMemo } from "react"
import { Navigate } from "react-router-dom";
import {api} from "../../api/backendApi";
import "../../css/objetsAdmin.css";

type Rarete = 'COMMUN' | 'PEU_COMMUN' | 'RARE' | 'LEGENDAIRE';

type TypeDegats =
  'FEU' |
  'GLACE' |
  'ACIDE' |
  'POISON' |
  'TONNERRE' |
  'PSYCHIQUE' |
  'NECROTIQUE' |
  'FORCE' |
  'PERCANT' |
  'CONTONDANT' |
  'TRANCHANT' |
  'RADIANT';

type TypeObjet = 
  'ARME' | 
  'ARME_2_MAINS' |
  'MUNITION' |
  'BOUCLIER' |
  'ARMURE' |
  'BOTTES' |
  'CASQUE' |
  'GANT' |
  'CAPE' |
  'BIJOU' |
  'TRINKET' |
  'POTION' |
  'PARCHEMIN' |
  'BAGUETTE' |
  'BATON' |
  'FOCALISATEUR' |
  'OUTIL' |
  'SAC' |
  'CONTENEUR' |
  'MARCHANDISE' |
  'AUTRE';

const TYPEDEGATS = {
  FEU: "FEU",
  GLACE: "GLACE",
  ACIDE: "ACIDE",
  POISON: "POISON",
  TONNERRE: "TONNERRE",
  PSYCHIQUE: "PSYCHIQUE",
  NECROTIQUE: "NECROTIQUE",
  FORCE: "FORCE",
  PERCANT: "PERCANT",
  CONTONDANT: "CONTONDANT",
  TRANCHANT: "TRANCHANT",
  RADIANT: "RADIANT",
} as const;

const TYPEOBJET = {
  ARME: "ARME",
  ARME_2_MAINS: "ARME_2_MAINS",
  MUNITION: "MUNITION",
  BOUCLIER: "BOUCLIER",
  ARMURE: "ARMURE",
  BOTTES: "BOTTES",
  CASQUE: "CASQUE",
  GANT: "GANT",
  CAPE: "CAPE",
  BIJOU: "BIJOU",
  TRINKET: "TRINKET",
  POTION: "POTION",
  PARCHEMIN: "PARCHEMIN",
  BAGUETTE: "BAGUETTE",
  BATON: "BATON",
  FOCALISATEUR: "FOCALISATEUR",
  OUTIL: "OUTIL",
  SAC: "SAC",
  CONTENEUR: "CONTENEUR",
  MARCHANDISE: "MARCHANDISE",
  AUTRE: "AUTRE",
} as const;

const RARETE = {
    COMMUN: "COMMUN",
    PEU_COMMUN: "PEU_COMMUN",
    RARE: "RARE",
    LEGENDAIRE: "LEGENDAIRE",
} as const;

interface Objet {
    id: string;
    nom: string;
    rarete: Rarete;
    type: TypeObjet;
    att: Number;
    def: Number;
    prix: Number;
    typeDegats: TypeDegats;
    degatsBonus: Number;
    typeBonus: TypeDegats;
    description: string;
};

export default function ObjetsAdmin() {
    const { estConnecte, estAdmin } = useAuth();
    const [listeObjets, setListeObjets] = useState<Objet[]>([]);
    const [objetSelection, setObjetSelection] = useState<Objet | null>(null);
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
        rarete: "COMMUN",
        type: "ARME",
        att: "",
        def: "",
        prix: "",
        typeDegats: "CONTONDANT",
        degatsBonus: "",
        typeBonus: "CONTONDANT",
        description: "",
    });

    const [formDataModifier, setFormDataModifier] = useState({
        nom: "",
        rarete: "",
        type: "",
        att: "",
        def: "",
        prix: "",
        typeDegats: "",
        degatsBonus: "",
        typeBonus: "",
        description: "",
    });

    const listeObjetsTriee = useMemo(
        () => [...listeObjets].sort((a,b) => a.nom.localeCompare(b.nom)), [listeObjets] //permet au tri de se refaire uniquement si listeObjets change
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
            const reponse = await api.post("/objet/creer", {
                ...formDataAjout,
                att: Number(formDataAjout.att), //casts en number pour les champs concernés
                def: Number(formDataAjout.def), 
                prix: Number(formDataAjout.prix), 
                degatsBonus: Number(formDataAjout.degatsBonus), 
            });
            setMessage(reponse.data.message);
            setFormDataAjout({
                nom: "",
                rarete: "COMMUN",
                type: "AUTRE",
                att: "",
                def: "",
                prix: "",
                typeDegats: "CONTONDANT",
                degatsBonus: "",
                typeBonus: "CONTONDANT",
                description: "",
            })
            recupererListeObjets();
            
        } catch (err: any) {
            console.error("Erreur lors de l'ajout", err);
            const messageErreur = err.response?.data?.erreur
            setMessage(messageErreur);
        }
    }

    const formulaireAjoutEstValide = () => { //valide que le formulaire est rempli avant d'enable le bouton. Seulement les champs obligatoires
        return(
            formDataAjout.nom.trim() !== "" &&
            formDataAjout.rarete.trim() !== "" &&
            formDataAjout.type.trim() !== "" &&
            formDataAjout.prix.trim() !== "" 
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
        if (!objetSelection) return; //si aucun objet n'est sélectionnée on ne pourra pas submit

        try {
            const reponse = await api.patch(`/objet/${objetSelection.id}`, {
                ...formDataModifier,
                att: Number(formDataModifier.att), //casts en number pour les champs concernés
                def: Number(formDataModifier.def), 
                prix: Number(formDataModifier.prix), 
                degatsBonus: Number(formDataModifier.degatsBonus),
            });
            setMessageModifier(reponse.data.message);
            setFormDataModifier({
                nom: "",
                rarete: "",
                type: "",
                att: "",
                def: "",
                prix: "",
                typeDegats: "",
                degatsBonus: "",
                typeBonus: "",
                description: "",
            })
            recupererListeObjets();
            setObjetSelection(null);
            
        } catch (err: any) {
            console.error("Erreur lors de la modification", err);
            const messageErreur = err.response?.data?.erreur
            setMessageModifier(messageErreur);
        }
    }

    const handleSelectionnerObjet = (objet: Objet) => {
        setObjetSelection(objet);
        setFormDataModifier({
            nom: objet.nom,
            rarete: objet.rarete,
            type: objet.type,
            att: ((objet.att === null) ? "" : String(objet.att)), // empêche null d'être affiché dans le formulaire
            def: ((objet.def === null) ? "" : String(objet.def)),
            prix: String(objet.prix),
            typeDegats: ((objet.typeDegats === null) ? "CONTONDANT" : objet.typeDegats),
            degatsBonus: ((objet.degatsBonus === null) ? "" : String(objet.degatsBonus)),
            typeBonus: ((objet.typeBonus === null ) ? "CONTONDANT" : objet.typeBonus),
            description: ((objet.description === null) ? "" : String(objet.description)),
        })
    }

    const supprimerObjet = async () => {
        if (!objetSelection) return;
        try {
            setSuppressionEnCours(true);
            await api.delete(`/objet/supprimer/${objetSelection.id}`)
            setMessageModifier("L'objet a été supprimé avec succès!");
            recupererListeObjets();
            setFormDataModifier({
                nom: "",
                rarete: "",
                type: "",
                att: "",
                def: "",
                prix: "",
                typeDegats: "",
                degatsBonus: "",
                typeBonus: "",
                description: "",
            })
            setObjetSelection(null);
        } catch (err:any) {
            console.error("Erreur lors de la suppression", err);
            setMessageModifier(err.response?.data?.erreur || "L'objet n'a pas pu être supprimé");
            setPopupSuppressionOuvert(false);
        } finally {
            setSuppressionEnCours(false);
            setPopupSuppressionOuvert(false);
        }
    }

    const recupererListeObjets = async () => {
        try {
            setChargement(true);
            const reponse = await api.get("/objet?limit=1000"); //évite la pagination mais pourrait un jour nécessiter d'être changé manuellement si on a > 1000 objets.
            setListeObjets(reponse.data.objets);

        } catch (err: any) {
            console.error("Erreur API", err);
            setErreur("Erreur lors du chargement des objets.");
        } finally {
            setChargement(false);
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
        recupererListeObjets();
    }, []);

    // les trois useEffect suivant permettent d'effacer les messages après 4 secondes
    useEffect(() => {
        if (message) {
            setMessageVisible(true);
            const timer = setTimeout(() => {
                setMessageVisible(false),
                setMessage("");}, 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        if (messageModifier) {
            setMessageModifierVisible(true);
            const timer = setTimeout(() => {
                setMessageModifierVisible(false);
                setMessageModifier("");}, 4000);
            return () => clearTimeout(timer);
        }
    }, [messageModifier]);

    useEffect(() => {
        if (erreur) {
            setErreurVisible(true);
            const timer = setTimeout(() => {
                setErreurVisible(false);
                setErreur("");
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [erreur]);

    // si le type ne peut pas recevoir la stat ATT ou DEF dans la base de données, le champ est reset lors de sa sélection
    // seul les armes ont du ATT et seul les vêtements/boucliers ont DEF
    // form Ajout
    useEffect(() => {
        if (["ARME", "ARME_2_MAINS"].includes(formDataAjout.type)) {
            setFormDataAjout((prev) => ({
                ...prev,
                def : "",
            }));
        } else if (["ARMURE", "BOTTES", "CASQUE", "BOUCLIER", "GANT"].includes(formDataAjout.type)) {
            setFormDataAjout((prev) => ({
                ...prev,
                att : "",
            }));
        } else {
            setFormDataAjout((prev) => ({
                ...prev,
                att : "",
                def : "",
            }));
        }
    }, [formDataAjout.type]);

    // si le type ne peut pas recevoir la stat ATT ou DEF dans la base de données, le champ est reset lors de sa sélection
    // seul les armes ont du ATT et seul les vêtements/boucliers ont DEF
    // form Modifier
    useEffect(() => {
        if (["ARME", "ARME_2_MAINS"].includes(formDataModifier.type)) {
            setFormDataModifier((prev) => ({
                ...prev,
                def : "",
            }));
        } else if (["ARMURE", "BOTTES", "CASQUE", "BOUCLIER", "GANT"].includes(formDataModifier.type)) {
            setFormDataModifier((prev) => ({
                ...prev,
                att : "",
            }));
        } else {
            setFormDataModifier((prev) => ({
                ...prev,
                att : "",
                def : "",
            }));
        }
    }, [formDataModifier.type]);

    if (!estConnecte || !estAdmin) {
        return <Navigate to="/connexion" replace />;
    }

    return (<>
    <div className="container-admin-quetes flex flex-col grow">
        <TitreBackground>Ajouter un objet</TitreBackground>
        <div className="container-ajout-quete flex flex-col w-full container-style text-white">

            <form onSubmit={handleSubmitAjout} className="form-container">
                <div className="container-ajout-champs grid grid-cols-5 gap-4 mx-8 mt-8">

                    <div className="flex flex-col gap-1 flex-2 col-span-2">
                        <label htmlFor="nom" className="form-labels">Nom:</label>
                        <input type="text" id="nom-ajout" name="nom" value={formDataAjout.nom} onChange={handleChangeAjout} className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base 
                        text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                        required placeholder="Ex: Lame de feu"/>
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                        <label htmlFor="rarete-ajout" className="form-labels">
                            Rareté:
                        </label>

                        <div className="relative">
                            <Select id="rarete-ajout" name="rarete" value={formDataAjout.rarete} onChange={handleChangeAjout} className="inline-flex w-full appearance-none items-center justify-between 
                            rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-xs outline-1 -outline-offset-1 outline-white/20 focus:outline-2 focus:outline-indigo-500">
                                {Object.entries(RARETE).map(([key, value]) => (
                                    <option key={key} value={value} className="bg-gray-800 text-white">
                                        {key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, " ")}
                                    </option>
                                ))}
                            </Select>
                            <ChevronDownIcon className="group-pointer-events-none absolute top-2.5 right-2.5 size-5 fill-white/60" aria-hidden="true"/>
                        </div>
                    </div>
                    

                    <div className="flex flex-col gap-1 flex-1 ">
                        <label htmlFor="type-ajout" className="form-labels truncate text-ellipsis">
                            Type d'objet:
                        </label>

                        <div className="relative">
                            <Select id="type-ajout" name="type" value={formDataAjout.type} onChange={handleChangeAjout} className="inline-flex w-full appearance-none items-center
                            justify-between rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-xs outline-1 -outline-offset-1 outline-white/20 focus:outline-2 focus:outline-indigo-500">
                                {Object.entries(TYPEOBJET).map(([key, value]) => (
                                    <option key={key} value={value} className="bg-gray-800 text-white">
                                        {key.charAt(0) + key.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </Select>
                            <ChevronDownIcon className="group-pointer-events-none absolute top-2.5 right-2.5 size-5 fill-white/60" aria-hidden="true"/>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 flex-1 ">
                        <label htmlFor="typeDegats-ajout" className="form-labels truncate text-ellipsis">
                            Type de dégâts:
                        </label>

                        <div className="relative">
                            <Select id="typeDegats-ajout" name="typeDegats" value={formDataAjout.typeDegats} onChange={handleChangeAjout} className="inline-flex w-full appearance-none items-center 
                            justify-between rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-xs outline-1 -outline-offset-1 outline-white/20 focus:outline-2 focus:outline-indigo-500">
                                {Object.entries(TYPEDEGATS).map(([key, value]) => (
                                    <option key={key} value={value} className="bg-gray-800 text-white">
                                        {key.charAt(0) + key.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </Select>
                            <ChevronDownIcon className="group-pointer-events-none absolute top-2.5 right-2.5 size-5 fill-white/60" aria-hidden="true"/>
                        </div>
                    </div>

                    
                </div>

                <div className="container-ajout-champs-bas grid grid-cols-5 gap-4 mx-8 mt-8">

                    <div className="flex flex-col gap-1 flex-1 ">
                        <label htmlFor="att" className="form-labels truncate text-ellipsis">
                            Att:
                        </label>
                        <input type="text" name="att" id="att-ajout" value={formDataAjout.att} onChange={handleChangeAjout} className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base 
                        text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm 
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale" 
                        placeholder="0"
                        disabled={!["ARME", "ARME_2_MAINS"].includes(formDataAjout.type)}/>
                    </div>

                    <div className="flex flex-col gap-1 flex-1 ">
                        <label htmlFor="def" className="form-labels truncate text-ellipsis">
                            Def:
                        </label>
                        <input type="text" name="def" id="def-ajout" value={formDataAjout.def} onChange={handleChangeAjout} className="font-sans block w-full rounded-md bg-white/5
                        px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm 
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale"
                        placeholder="0"
                        disabled={!["ARMURE", "BOTTES", "CASQUE", "BOUCLIER", "GANT"].includes(formDataAjout.type)} />
                    </div>

                    <div className="flex flex-col gap-1 flex-1 ">
                        <label htmlFor="typeDegats-ajout" className="form-labels truncate text-ellipsis ">
                            Type Bonus:
                        </label>

                        <div className="relative">
                            <Select id="typeBonus-ajout" name="typeBonus" value={formDataAjout.typeBonus} onChange={handleChangeAjout} className="inline-flex flex-1 w-full appearance-none
                            items-center justify-between rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-xs outline-1 -outline-offset-1 outline-white/20 focus:outline-2 focus:outline-indigo-500">
                                {Object.entries(TYPEDEGATS).map(([key, value]) => (
                                    <option key={key} value={value} className="bg-gray-800 text-white">
                                        {key.charAt(0) + key.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </Select>
                            <ChevronDownIcon className="group-pointer-events-none absolute top-2.5 right-2.5 size-5 fill-white/60" aria-hidden="true"/>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 flex-1 ">
                        <label htmlFor="degatsBonus" className="form-labels truncate text-ellipsis">
                            Dégâts Bonus:
                        </label>
                        <input type="text" name="degatsBonus" id="degatsBonus-ajout" value={formDataAjout.degatsBonus} onChange={handleChangeAjout} className="font-sans block w-full rounded-md bg-white/5
                        px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm" placeholder="0" />
                    </div>

                    <div className="flex flex-col gap-1 flex-1 ">
                        <label htmlFor="prix" className="form-labels truncate text-ellipsis">
                            Prix:
                        </label>
                        <input type="text" name="prix" id="prix-ajout" value={formDataAjout.prix} onChange={handleChangeAjout} className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5
                        text-base text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                        required
                        placeholder="0" />
                    </div>
                </div>


                <div className="container-ajout-description flex flex-col gap-1 mb-8">
                    <label htmlFor="description" className="ml-8 mt-4 form-labels">Description:</label>
                    <textarea className="p-6 min-h-80 resize-none" name="description" id="description-ajout" value={formDataAjout.description} onChange={handleChangeAjout} placeholder="Cet objet ancestral..."/>
                </div>
                <div className="container-ajout-bouton flex justify-end mr-8 mb-8">
                    <button className="btn-nav create disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale" disabled={!formulaireAjoutEstValide()} >Ajouter</button>
                </div>
            </form>
                <p className={`msg flex justify-center transition-opacity duration-300 ${messageVisible ? "opacity-100" : "opacity-0"}`}>
                    {message}
                </p>
        </div>


{/* ==================== Portion de modification des objets ==================== */}



        <TitreBackground>Modifier un objet</TitreBackground>
        <div className="container-modif-quete container-style flex flex-col text-white">

            <form className="modif-form-container " onSubmit={handleSubmitModifier}>
                <fieldset disabled={!objetSelection} className="contents">


                    <div className="container-modif-champs-liste flex max-h-200">
                        <div className="container-champs-description flex flex-2 flex-col">
                            <div className="container-modif-gauche min-w-0 grid grid-cols-2 gap-4 mx-8 mt-8 flex-2 flex-col">

                                <div className="modif-nom flex flex-col gap-1 col-span-2">
                                    <label htmlFor="nom" className="text-2xl form-labels truncate text-ellipsis">Nom:</label>
                                    <input type="text" id="nom-modifier" name="nom" value={formDataModifier.nom} onChange={handleChangeModifier} className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base 
                                text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm"
                                required placeholder="Ex: Lame de feu"/>
                                </div>

                                <div className="flex flex-col gap-1 flex-1">
                                    <label htmlFor="rarete-Modifier" className="form-labels truncate text-ellipsis">
                                        Rareté:
                                    </label>

                                    <div className="relative">
                                        <Select id="rarete-Modifier" name="rarete" value={formDataModifier.rarete} onChange={handleChangeModifier} className="inline-flex w-full appearance-none items-center justify-between 
                                        rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-xs outline-1 -outline-offset-1 outline-white/20 focus:outline-2 focus:outline-indigo-500">
                                            {Object.entries(RARETE).map(([key, value]) => (
                                                <option key={key} value={value} className="bg-gray-800 text-white">
                                                    {key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, " ")}
                                                </option>
                                            ))}
                                        </Select>
                                        <ChevronDownIcon className="group-pointer-events-none absolute top-2.5 right-2.5 size-5 fill-white/60" aria-hidden="true"/>
                                    </div>
                                </div>

                            <div className="flex flex-col gap-1 flex-1 ">
                                <label htmlFor="type-Modifier" className="form-labels truncate text-ellipsis">
                                    Type d'objet:
                                </label>

                                <div className="relative">
                                    <Select id="type-modifier" name="type" value={formDataModifier.type} onChange={handleChangeModifier} className="inline-flex w-full appearance-none items-center
                                    justify-between rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-xs outline-1 -outline-offset-1 outline-white/20 focus:outline-2 focus:outline-indigo-500">
                                        {Object.entries(TYPEOBJET).map(([key, value]) => (
                                            <option key={key} value={value} className="bg-gray-800 text-white">
                                                {key.charAt(0) + key.slice(1).toLowerCase()}
                                            </option>
                                        ))}
                                    </Select>
                                    <ChevronDownIcon className="group-pointer-events-none absolute top-2.5 right-2.5 size-5 fill-white/60" aria-hidden="true"/>
                                </div>
                            </div>



                                <div className="flex flex-col gap-1 flex-1 ">
                                    <label htmlFor="typeDegats-Modifier" className="form-labels truncate text-ellipsis">
                                        Type de dégâts:
                                    </label>

                                    <div className="relative">
                                        <Select id="typeDegats-Modifier" name="typeDegats" value={formDataModifier.typeDegats} onChange={handleChangeModifier} className="inline-flex w-full appearance-none items-center 
                                        justify-between rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-xs outline-1 -outline-offset-1 outline-white/20 focus:outline-2 focus:outline-indigo-500">
                                            {Object.entries(TYPEDEGATS).map(([key, value]) => (
                                                <option key={key} value={value} className="bg-gray-800 text-white">
                                                    {key.charAt(0) + key.slice(1).toLowerCase()}
                                                </option>
                                            ))}
                                        </Select>
                                        <ChevronDownIcon className="group-pointer-events-none absolute top-2.5 right-2.5 size-5 fill-white/60" aria-hidden="true"/>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 flex-1 ">
                                    <label htmlFor="typeDegats-Modifier" className="form-labels truncate text-ellipsis ">
                                        Type Bonus:
                                    </label>

                                    <div className="relative">
                                        <Select id="typeBonus-Modifier" name="typeBonus" value={formDataModifier.typeBonus} onChange={handleChangeModifier} className="inline-flex flex-1 w-full appearance-none
                                        items-center justify-between rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-xs outline-1 -outline-offset-1 outline-white/20 focus:outline-2 focus:outline-indigo-500">
                                            {Object.entries(TYPEDEGATS).map(([key, value]) => (
                                                <option key={key} value={value} className="bg-gray-800 text-white">
                                                    {key.charAt(0) + key.slice(1).toLowerCase()}
                                                </option>
                                            ))}
                                        </Select>
                                        <ChevronDownIcon className="group-pointer-events-none absolute top-2.5 right-2.5 size-5 fill-white/60" aria-hidden="true"/>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 flex-1 ">
                                    <label htmlFor="att-modifier" className="form-labels truncate text-ellipsis">
                                        Att:
                                    </label>
                                    <input type="text" name="att" id="att-modifier" value={formDataModifier.att} onChange={handleChangeModifier} className="font-sans block w-full rounded-md bg-white/5 px-3 py-1.5 text-base 
                                    text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm 
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale" 
                                    placeholder="0"
                                    disabled={!["ARME", "ARME_2_MAINS"].includes(formDataModifier.type)}/>
                                </div>

                                <div className="flex flex-col gap-1 flex-1 ">
                                    <label htmlFor="def-modifier" className="form-labels truncate text-ellipsis">
                                        Def:
                                    </label>
                                    <input type="text" name="def" id="def-ajout" value={formDataModifier.def} onChange={handleChangeModifier} className="font-sans block w-full rounded-md bg-white/5
                                    px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale"
                                    placeholder="0"
                                    disabled={!["ARMURE", "BOTTES", "CASQUE", "BOUCLIER", "GANT"].includes(formDataModifier.type)} />
                                </div>



                                <div className="modif-nom flex flex-col gap-1">
                                    <label htmlFor="degatsBonus" className="form-labels truncate text-ellipsis">Dégâts bonus:</label>
                                    <input type="text" id="degatsBonus-modifier" name="degatsBonus" value={formDataModifier.degatsBonus} onChange={handleChangeModifier} className="font-sans block w-full rounded-md bg-white/5
                                    px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm" placeholder="0"/>
                                    
                                </div>

                                <div className="modif-nom flex flex-col gap-1">
                                    <label htmlFor="prix" className="form-labels truncate text-ellipsis">Prix:</label>
                                    <input type="text" id="prix-modifier" name="prix" value={formDataModifier.prix} onChange={handleChangeModifier} className="flex-end font-sans block w-full rounded-md
                                    bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/20 placeholder:text-white/60 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500
                                    sm:text-sm"required placeholder="0"/>
                                </div>
                            </div>

                            <div className="modif-description flex flex-col flex-1  gap-1 mb-8 mt-6">
                                <label htmlFor="description" className=" ml-8 form-labels">Description:</label>
                                <textarea className="flex-1 p-6 resize-none" name="description" id="description-modifier" value={formDataModifier.description} onChange={handleChangeModifier} placeholder="Cet objet ancestral..."/>
                            </div>

                        </div>




                        <div className="container-modif-droite flex flex-1 inner-container m-8 min-w-0">
                            <ul className="w-full liste-quetes flex flex-col">
                                {erreur && (<span className={`msg flex justify-center transition-opacity duration-300 ${erreurVisible ? "opacity-100" : "opacity-0"}`}>{erreur}</span>)}
                                {!chargement && listeObjets.length === 0 && (
                                    <span className="perso-nom">Aucun objet à afficher.</span>
                                )}
                                {listeObjetsTriee.map((objet) => {
                                    return (
                                <li key={objet.id} className="quetes-modif-list" onClick={() => handleSelectionnerObjet(objet)}>{objet.nom}<br /><span className="diff">[  {objet.type.replace(/_/g, " ")}  ]</span></li>
                                )})}
                            </ul>
                        </div>
                    </div>

                    <div className="container-modif-boutons flex flex-start m-8">
                        <button className="btn-nav create disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale" disabled={!objetSelection}>Sauvegarder</button>
                        <button className="btn-nav delete disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:grayscale"
                        type="button" onClick={() => objetSelection && setPopupSuppressionOuvert(true)} disabled={!objetSelection}>Supprimer</button>

                    </div>
                </fieldset>
            </form>
                <p className={`msg flex justify-center transition-opacity duration-300 ${messageModifierVisible ? "opacity-100" : "opacity-0"}`}>
                    {messageModifier}
                </p>
        </div>
    </div>

    {popupSuppressionOuvert && (
        <div className="popup-overlay" onClick={() => setPopupSuppressionOuvert(false)}>
            <div className="popup-contenu" onClick={(e) => e.stopPropagation()}>
                <h2 className="mb-8">Suppression de l'objet</h2>
                <p className="text-white">
                    Cette action est irréversible. L'objet sera
                    définitivement supprimé pour tous. Voulez-vous continuer ?
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
                        onClick={supprimerObjet}
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