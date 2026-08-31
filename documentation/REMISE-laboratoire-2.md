# Laboratoire 2 — Fiche de remise


## 👥 Équipe

| Nom complet | rôle |
|-------------|------------------|
| Clément Laflamme  | Full-stack       |
| Mathieu Gosselin  | Full-stack       |
| Francis Boisvert  | Full-stack       |

## 🎯 Sujet (choisi au Laboratoire 1)

Sujet : _RPG_

## 🔗 Dépôt GitHub

Lien : https://github.com/powemetal/royaume-maxremi

## ▶️ Lancer le projet

Backend :

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev        # http://localhost:3000
```

Frontend :

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Variables d'environnement à créer (non committées) : `DATABASE_URL`, `JWT_SECRET`.

## ✅ Fonctionnalités réalisées

- [X] Backend : CRUD complet
- [X] Backend : authentification JWT + rôles
- [X] Backend : intégration de l'API publique (Axios)
- [X] Backend : CORS activé
- [X] Frontend : affichage des données (useEffect + axios, 3 états)
- [X] Frontend : formulaire(s) de création -> (Objets, Quetes, Personnages)
- [X] Frontend : formulaire(s) de modification -> (Monstres, Objets, Quetes, Personnages
- [X] Frontend : connexion / inscription (token + AuthContext)
- [X] Frontend : action protégée (visible seulement si connecté sauf pour afficher les quetes et les monstres qui doivent être publiques)