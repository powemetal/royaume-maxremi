import "../css/navbar.css";

export default function Navbar() {
  return (
    <nav className="container-nav" style={{flexGrow: 1}}>
      <div className="container-logo">
        <img
          src="src\assets\images\MaxRemiLogoBlanc.png"
          alt="Logo Maxremi"
          id="logo-maxremi"
        />
        {/* <p>Royaume Maxremi</p> */}
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex justify-end gap-3">
          <button>Administrer</button>
          <button>Se connecter</button>
        </div>
        <div className="flex flex-1 items-end justify-center">
          <button className="px-4 py-2 mb-2 ml-4">Mes Personnages</button>
          <button className="px-4 py-2 mb-2 ml-4">Monstres</button>
        </div>
      </div>
    </nav>
  );
}
