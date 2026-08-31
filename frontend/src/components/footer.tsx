import { useEffect, useState } from "react";
import "../css/footer.css";
import { api } from "../api/backendApi";

export default function Footer() {
  const [estOnline, setEstOnline] = useState<boolean>(false);

  const apiOnline = async () => {
    try {
      const check = await api.get("/api/status/");
      if (check.data.dndApi.status === "up") {
        setEstOnline(true);
      } else {
        setEstOnline(false);
      }
    } catch (e) {
      console.error(`Erreur avec l'api: ${e}`);
      setEstOnline(false);
    }
  };

  useEffect(() => {
    apiOnline();
  }, []);

  return (
    <footer className="container-footer flex flex-col items-center py-4">
      <div className="serverStatusBadge flex items-center gap-2">
        <p className={`text-3xl statusDot ${estOnline ? "text-green-500" : "text-red-500"}`}>⦿</p>

        <p className={`statusText font-bold ${estOnline ? "text-green-500" : "text-red-500"}`}>{estOnline ? "Serveur en ligne" : "Serveur hors ligne"}</p>
      </div>

      <p className="text-xs mt-2">&copy; 2026 Royaume MaxRemi. Tous droits réservés.</p>
    </footer>
  );
}
