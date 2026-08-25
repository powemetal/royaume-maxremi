import TitreBackground from "../../components/titreBackground"
import { useState, useEffect } from "react"
import "../../css/quetesAdmin.css";

const DIFFICULTES = {
    FACILE: "FACILE",
    MOYEN: "MOYEN",
    DIFFICILE: "DIFFICILE",
    LEGENDAIRE: "LEGENDAIRE",
};


export default function QuetesAdmin() {

    const [nom, setNom] = useState("");
    const [difficulte, setDifficulte] = useState<string>("");
    const [recompense, setRecompense] = useState<Number>(0);
    const [description, setDescription] = useState<string>("");
    const [formData, setFormData] = useState({
        nom: "",
        difficulte: "",
        description: "",
        recompense: "",
    });

    const handleChange = () => {
        

    }


    return (<>
    <div className="container-admin-quetes flex flex-col grow">
        <TitreBackground>Ajouter une quête</TitreBackground>
        <div className="container-ajout-quete flex flex-col container-style">

            <form onSubmit={handleChange} className="form-container">
                <div className="container-ajout-champs flex space-x-8 justify-evenly shrink mb-8 mt-8">
                    <label htmlFor="nom">Nom:</label>
                    <input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required placeholder="Ex: Dératiser le champ"/>
                    <label htmlFor="difficulte">Difficulté:</label>
                    <select onChange={handleChange} value={formData.difficulte} name="difficulte" id="difficulte" required>
                        {Object.entries(DIFFICULTES).map(([key, value]) => (
                            <option key={key} value={value}>
                                {key.charAt(0) + key.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="recompense">Récompense:</label>
                    <input type="text" name="recompense" id="recompense" value={formData.recompense} onChange={handleChange} required placeholder="500" />
                </div>
                <div className="container-ajout-description flex flex-col mb-8">
                    <label htmlFor="description" className="ml-8">Description:</label>
                    <textarea name="description" id="description" rows={10} cols={50} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Le fermier vous demande..."></textarea>
                </div>
                <div className="container-ajout-bouton flex justify-end mr-8 mb-8 ">
                    <button className="btn-nav create">Ajouter</button>
                </div>
            </form>
        </div>




        <TitreBackground>Modifier une quête</TitreBackground>
        <div className="container-modif-quete container-style flex flex-col">
            <form className="modif-form-container">
                <div className="container-modif-champs-liste flex">
                    <div className="container-modif-gauche flex flex-2 flex-col">
                        <div className="modif-nom flex">
                            <label htmlFor="nom">Nom:</label>
                            <input type="text" id="nomModifie" name="nomModifie" value={formData.nomModifie} onChange={handleChange} required placeholder="Ex: Dératiser le champ"/>
                        </div>
                        <div className="modif-diff flex">
                            <label htmlFor="difficulte">Difficulte:</label>
                            <select onChange={handleChange} value={formData.difficulteModifie} name="difficulteModifie" id="difficulteModifie" required>
                                {Object.entries(DIFFICULTES).map(([key, value]) => (
                                    <option key={key} value={value}>
                                        {key.charAt(0) + key.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>                        
                        <div className="modif-nom flex">
                            <label htmlFor="recompense">Récompense:</label>
                            <input type="text" id="recompenseModifie" name="recompenseModifie" value={formData.recompenseModifie} onChange={handleChange} required placeholder="500"/>
                        </div>
                        <div className="modif-description flex flex-col">
                            <label htmlFor="description">Description:</label>
                            <textarea name="descriptionModifie" id="descriptionModifie" rows={10} cols={25} value={descriptionModifie} onChange={(e) => setDescription(e.target.value)} placeholder="Le fermier vous demande..."></textarea>

                        </div>
                    </div>



                    <div className="container-modif-droite flex flex-1 inner-container m-8">
                        <ul className="w-full">
                            <li className="quetes-modif-list">Vaincre Grok</li>
                            <li className="quetes-modif-list">Vaincre Grok</li>
                            <li className="quetes-modif-list">Vaincre Grok</li>
                            <li className="quetes-modif-list">Vaincre Grok</li>
                            <li className="quetes-modif-list">Vaincre Grok</li>
                        </ul>
                    </div>

                </div>
                <div className="container-modif-boutons flex flex-start m-8">
                    <button className="btn-nav create">Sauvegarder</button>
                    <button className="btn-nav delete">Supprimer</button>

                </div>
            </form>


        </div>


    </div>

    
    
    
    
    </>)
}