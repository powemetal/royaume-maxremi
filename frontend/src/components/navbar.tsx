import "../css/navbar.css";

export default function Navbar() {
  return (
    <div className="container-nav">
      <div className="container-logo">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2619/2619285.png"
          alt="Logo Maxremi"
          id="logo-maxremi"
        />
        <p>Royaume Maxremi</p>
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
    </div>
  );
}
