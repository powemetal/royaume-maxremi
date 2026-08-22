import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Connexion from "./pages/connexion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Accueil from "./pages/accueil";
import Inscription from "./pages/inscription";
import Personnages from "./pages/personnages";
import Monstres from "./pages/monstres";
import Objets from "./pages/objets";
import UtilisateursAdmin from "./pages/admin/utilisateursAdmin";
import QuetesAdmin from "./pages/admin/quetesAdmin";
import MonstresAdmin from "./pages/admin/monstresAdmin";
import ObjetsAdmin from "./pages/admin/objetsAdmin";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <div
        className="container-app"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          flex: "1 0 auto",
        }}
      >
        <Navbar />

        <main
          className="container-main"
          style={{ display: "flex", flexGrow: 1 }}
        >
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/personnages" element={<Personnages />} />
            <Route path="/monstres" element={<Monstres />} />
            <Route path="/objets" element={<Objets />} />
            <Route path="/admin/utilisateurs" element={<UtilisateursAdmin />} />
            <Route path="/admin/quetes" element={<QuetesAdmin />} />
            <Route path="/admin/monstres" element={<MonstresAdmin />} />
            <Route path="/admin/objets" element={<ObjetsAdmin />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
