import {
  useState,
  useContext,
  createContext,
  useEffect,
  type ReactNode,
} from "react";

type AuthType = {
  token: string | null;
  estConnecte: boolean;
  estAdmin: boolean;
  chargement: boolean;
  seConnecter: (t: string) => void;
  seDeconnecter: () => void;
};

const AuthContext = createContext<AuthType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [estAdmin, setEstAdmin] = useState<boolean>(false);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const estRoleAdmin = localStorage.getItem("estAdmin") === "true";
    if (token) {
      setToken(token);
      setEstAdmin(estRoleAdmin);
    }
    setChargement(false);
  }, []);

  function seConnecter(nouveauToken: string, estAdmin: boolean = false) {
    localStorage.setItem("token", nouveauToken);
    localStorage.setItem("estAdmin", String(estAdmin));
    setToken(nouveauToken);
    setEstAdmin(estAdmin);
  }

  function seDeconnecter() {
    localStorage.removeItem("token");
    localStorage.removeItem("estAdmin");
    setToken(null);
    setEstAdmin(false);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        estConnecte: !!token,
        estAdmin,
        chargement,
        seConnecter,
        seDeconnecter,
      }}
    >
      {!chargement && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider",
    );
  }
  return context;
};
