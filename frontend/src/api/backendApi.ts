import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.code && error.response?.code === "TOKEN_INVALIDE") {
      // Token invalide ou expiré : déconnexion automatique
      localStorage.removeItem("token");
      localStorage.removeItem("estAdmin");
      window.location.href = "/connexion";
    }
    return Promise.reject(error);
  }
);
