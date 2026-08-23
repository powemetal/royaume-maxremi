import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../css/compte.css";
import TitreBackground from "../components/titreBackground";

export default function Compte() {
    return (<>
    
    <div className="container-compte flex flex-col grow">
        <div className="container-utilisateur flex justify-center gap-12">
            <div className="user-avatar"><img src="\src\assets\images\avatars\RMR02.jpeg" alt="avatar" /></div>
            <div className="container-nom-suppr flex flex-col">
                <h2 className="user-nom m-1">Nom Utilisateur</h2>
                <button className="btn-nav delete m-1">Supprimer mon compte</button>
                <button className="btn-nav create m-1">Créer un personnage</button>
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