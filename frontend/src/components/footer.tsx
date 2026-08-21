import "../css/footer.css";

export default function Footer() {
  return (
    <footer className="container-footer" style={{ display: "flex", alignContent: "center", flexDirection: "column"}}>

        <div className="serverStatusBadge" style={{ display: "flex", alignItems: "center", gap: "6px"}}>
            <p className="text-3xl statusDot" style={{color: "green"}}>⦿</p>
            <p className="statusText" style={{fontWeight: "bold", color: "green"}}>Serveur en ligne</p>
        </div>
        <p style={{fontSize: "0.8em", flexGrow: 1, alignSelf:"center", marginBottom: "12px" }}>&copy; 2026 Royaume MaxRemi. Tous droits réservés.</p>

    
    </footer>
  );
}