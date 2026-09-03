# [Le Royaume de Maxremi]

## 🧙‍♂️ Backend de jeu RPG utilisant l'API de DND 5e édition.

## 🚀 Technologies utilisées

    - Node
    - Typescript
    - Express
    - Prisma + Neon
    - Axios
    - JWT + bcrypt
    - Cors
    - React
    - TailwindCSS

## 🛠️ Prérequis

Vous devez avoir:

- Node.js
- Une instance de base de données Neon (neon.com), c'est gratuit.

## ⚙️ Installation et Configuration:

    git clone https://github.com/powemetal/royaume-maxremi.git

    cd royaume-maxremi/backend

Installer les dépendances:

    npm install

Configuration des variables d'environnement :

    Crée un fichier .env à la racine du backend du projet et ajouter le lien vers Neon.

    Voir .env.example.

Initialiser Prisma (Base de données) :

Générer le client Prisma et lancer les migrations pour créer les tables:

    npx prisma generate
    npx prisma migrate dev --name init

Lancer le serveur:

    npm run dev

Installer les dependances du frontend

    ouvrir un nouveau terminal au dossier: royaume-maxremi/frontend
    npm install

Lancer le serveur frontend

    npm run dev

Ouvrir une fenêtre du navigateur

    http://localhost:5173/

## 🌐 Services externes

    DND 5e SRD API : https://www.dnd5eapi.co/

## 🛣️ Liste des routes:

Routes

> **Note :** L'adresse de base pour toutes les requêtes est `http://localhost:3000`. Certaines routes nécessitent un token d'authentification (`Bearer token`) dans l'en-tête `Authorization`.

---

### 1. Authentification

| Méthode | Route             | Description                                  | Accès       |
| :------ | :---------------- | :------------------------------------------- | :---------- |
| `POST`  | `/auth/register`  | Création de compte (Utilisateur ou Admin)    | Public      |
| `POST`  | `/auth/login`     | Connexion et obtention du token JWT          | Public      |
| `GET`   | `/auth/me`        | Récupère les infos de l'utilisateur connecté | Authentifié |

---

### 2. Monstres

| Méthode  | Route                     | Description                     | Accès  |
| :------- | :------------------------ | :------------------------------ | :----- |
| `GET`    | `/monstre/`               | Liste tous les monstres         | Public |
| `GET`    | `/monstre/:nom`           | Détail d'un monstre par son nom | Public |
| `POST`   | `/monstre/ajouter/:nom`   | Ajoute un nouveau monstre       | MDJ    |
| `PATCH`  | `/monstre/:id`           | Modifie un monstre existant     | MDJ    |
| `DELETE` | `/monstre/supprimer/:id` | Supprime un monstre             | MDJ    |
| `GET`    | `/recherche/:nom`        | Recherche un monstre dans l'api | MDJ    |

---

### 3. Objets

| Méthode  | Route                   | Description                   | Accès  |
| :------- | :---------------------- | :---------------------------- | :----- |
| `GET`    | `/objet/`               | Liste tous les objets         | Public |
| `GET`    | `/objet/:nom`           | Détail d'un objet par son nom | Public |
| `POST`   | `/objet/creer`          | Crée un nouvel objet          | MDJ    |
| `PATCH`  | `/objet/:id`           | Modifie un objet existant     | MDJ    |
| `DELETE` | `/objet/supprimer/:id` | Supprime un objet             | MDJ    |

---

### 4. Quêtes

| Méthode  | Route                   | Description                                            | Accès  |
| :------- | :---------------------- | :----------------------------------------------------- | :----- |
| `GET`    | `/quete`                | Liste les quêtes (filtre par `?difficulte=X` possible) | Public |
| `GET`    | `/quete/:nom`           | Détail d'une quête par son nom                         | Public |
| `POST`   | `/quete/creer`          | Crée une nouvelle quête                                | MDJ    |
| `PATCH`  | `/quete/:id`           | Modifie une quête existante                            | MDJ    |
| `DELETE` | `/quete/supprimer/:id` | Supprime une quête                                     | MDJ    |

---

### 5. Utilisateurs & Personnages

| Méthode  | Route                        | Description                    | Accès  |
| :------- | :--------------------------- | :----------------------------- | :----- |
| `POST`   | `/utilisateur/creer`         | Crée un compte utilisateur     | MDJ    |
| `GET`    | `/utilisateur/recuperer/:id` | Récupère les infos utilisateur | MDJ    |
| `PATCH`  | `/utilisateur/modifier/:id`  | Modifie un utilisateur         | MDJ    |
| `DELETE` | `/utilisateur/supprimer/:id` | Supprime un utilisateur        | MDJ    |
| `POST`   | `/personnage/creer`          | Crée un personnage             | Joueur |
| `GET`    | `/personnage/recuperer/:id`  | Affiche le personnage          | Joueur |
| `PATCH`  | `/personnage/modifier/:id`   | Modifie un personnage          | MDJ    |
| `DELETE` | `/personnage/supprimer/:id`  | Supprime un personnage         | Joueur |

---

### 6. Journal de Quêtes & Inventaire

| Méthode  | Route                                | Description                          | Accès  |
| :------- | :----------------------------------- | :----------------------------------- | :----- |
| `POST`   | `/persoquete/ajouter`                | Ajoute une quête au journal du perso | Joueur |
| `GET`    | `/persoquete/:idPerso`               | Affiche le journal de quêtes         | Joueur |
| `PATCH`  | `/persoquete/journal/reussir/:id`    | Valide une quête                     | Joueur |
| `PATCH`  | `/persoquete/journal/echouer/:id`    | Échoue une quête                     | Joueur |
| `DELETE` | `/persoquete/journal/abandonner/:id` | Abandonne une quête                  | Joueur |
| `GET`    | `/inventaire/:idPerso`               | Récupère l'inventaire                | Joueur |
| `POST`   | `/inventaire/ajouter`                | Ajoute un objet à l'inventaire       | Joueur |
| `DELETE` | `/inventaire/retirer`                | Retire un objet de l'inventaire      | Joueur |

## Collection de tests

### Utiliser le fichier tests.rest

Il est possible de tester les routes individuellement à partir du fichier test.rest. Notez que certains tests nécessitent d'affecter des UUID aux variables `@uuidPerso`, `@uuidQuete`, `@uuidPersoQuete`, `@uuidUser`. Ces UUID doivent être valides dans votre base de données.

Pour lancer des tests à partir de test.rest:

    - Assurez-vous d'avoir lancé le serveur backend
    - Exécutez des requêtes à partir du fichier test.rest en cliquant

# Demo

## Page d'accueil
![alt text](documentation/images/image.png)

## Inscription
![alt text](documentation/images/image-1.png)

## Connexion
![alt text](documentation/images/image-2.png)
![alt text](documentation/images/image-3.png)

## Creation de personnage
![alt text](documentation/images/image-5.png)
![alt text](documentation/images/image-6.png)
![alt text](documentation/images/image-7.png)

## Suppression de personnage
![alt text](documentation/images/image-8.png)
![alt text](documentation/images/image-9.png)

## Affichage publique des Monstres
![alt text](documentation/images/image-11.png)

## Filtres:
### Dragon
![alt text](documentation/images/image-10.png)
### Très Petit
![alt text](documentation/images/image-12.png)
### Orc
![alt text](documentation/images/image-13.png)
### Alignement
![alt text](documentation/images/image-14.png)

### Affichage publique des objets:
![alt text](documentation/images/image-15.png)

## Filtres:
### Arme
![alt text](documentation/images/image-16.png)
### Rarete
![alt text](documentation/images/image-17.png)
### Prix decroissant
![alt text](documentation/images/image-18.png)


## Administration:
### Connexion:
![alt text](documentation/images/image-19.png)
![alt text](documentation/images/image-20.png)

## Admin utilisateurs:
![alt text](documentation/images/image-21.png)
### Recherche
![alt text](documentation/images/image-22.png)
### Suppression du compte
![alt text](documentation/images/image-23.png)
![alt text](documentation/images/image-24.png)


## Admin quetes:
### Ajouter une quete
![alt text](documentation/images/image-25.png)
![alt text](documentation/images/image-26.png)
![alt text](documentation/images/image-27.png)
![alt text](documentation/images/image-28.png)

### Mofidier une quete:
![alt text](documentation/images/image-29.png)
![alt text](documentation/images/image-30.png)
![alt text](documentation/images/image-31.png)


## Admin Monstres:
### Recherche de monstres dans l'api DND pour les ajouter
![alt text](documentation/images/image-32.png)
![alt text](documentation/images/image-33.png)
### Modifier un monstre:
![alt text](documentation/images/image-34.png)
![alt text](documentation/images/image-35.png)
![alt text](documentation/images/image-36.png)
![alt text](documentation/images/image-37.png)
## 👤 Auteurs

    Clément Laflamme
    Francis Boisvert
    Mathieu Gosselin
    Pascale Mercier (TP1)
