[Le Royaume de Maxremi]

🧙‍♂️ Backend de jeu RPG utilisant l'API de DND 5e édition.


🚀 Technologies utilisées

    - Node
    - Express
    - Prisma + Neon
    - Axios
    - JWT + bcrypt


🛠️ Prérequis

Vous devez avoir:

  - Node.js
  - Une instance de base de données Neon (neon.com), c'est gratuit.


⚙️ Installation et Configuration:

    git clone https://github.com/powemetal/royaume-maxremi.git
    cd royaume-maxremi

Installer les dépendances:

    npm install

Configuration des variables d'environnement :

    Crée un fichier .env à la racine du backend du projet et ajouter le lien vers Neon. Voir .env.example.

Initialiser Prisma (Base de données) :
Génère le client Prisma et lance les migrations pour créer les tables :

    npx prisma generate
    npx prisma migrate dev --name init
    
Lancer le serveur:

    npm run dev

🛣️ Liste des routes:



**  À COMPLÉTER!!! **


🌐 Services externes

    DND 5e SRD API : https://www.dnd5eapi.co/

Routes
> **Note :** L'adresse de base pour toutes les requêtes est `http://localhost:3000`. Certaines routes nécessitent un token d'authentification (`Bearer token`) dans l'en-tête `Authorization`.

---

## 1. Authentification
| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Création de compte (Utilisateur ou Admin) | Public |
| `POST` | `/auth/login` | Connexion et obtention du token JWT | Public |
| `GET` | `/auth/me` | Récupère les infos de l'utilisateur connecté | Authentifié |

---

## 2. Monstres
| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `GET` | `/monstre/` | Liste tous les monstres | Public |
| `GET` | `/monstre/:nom` | Détail d'un monstre par son nom | Public |
| `POST` | `/monstre/ajouter/:nom` | Ajoute un nouveau monstre | MDJ |
| `PATCH` | `/monstre/:nom` | Modifie un monstre existant | MDJ |
| `DELETE` | `/monstre/supprimer/:nom` | Supprime un monstre | MDJ |

---

## 3. Objets
| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `GET` | `/objet/` | Liste tous les objets | Public |
| `GET` | `/objet/:nom` | Détail d'un objet par son nom | Public |
| `POST` | `/objet/creer` | Crée un nouvel objet | MDJ |
| `PATCH` | `/objet/:nom` | Modifie un objet existant | MDJ |
| `DELETE` | `/objet/supprimer/:nom` | Supprime un objet | MDJ |

---

## 4. Quêtes
| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `GET` | `/quete` | Liste les quêtes (filtre par `?difficulte=X` possible) | Public |
| `GET` | `/quete/:nom` | Détail d'une quête par son nom | Public |
| `POST` | `/quete/creer` | Crée une nouvelle quête | MDJ |
| `PATCH` | `/quete/:nom` | Modifie une quête existante | MDJ |
| `DELETE` | `/quete/supprimer/:nom` | Supprime une quête | MDJ |

---

## 5. Utilisateurs & Personnages
| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `POST` | `/utilisateur/creer` | Crée un compte utilisateur | MDJ |
| `GET` | `/utilisateur/recuperer/:id` | Récupère les infos utilisateur | MDJ |
| `PATCH` | `/utilisateur/modifier/:id` | Modifie un utilisateur | MDJ |
| `DELETE` | `/utilisateur/supprimer/:id` | Supprime un utilisateur | MDJ |
| `POST` | `/personnage/creer` | Crée un personnage | Joueur |
| `GET` | `/personnage/recuperer/:id` | Affiche le personnage | Joueur |
| `PATCH` | `/personnage/modifier/:id` | Modifie un personnage | MDJ |
| `DELETE` | `/personnage/supprimer/:id` | Supprime un personnage | Joueur |

---

## 6. Journal de Quêtes & Inventaire
| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `POST` | `/persoquete/ajouter` | Ajoute une quête au journal du perso | Joueur |
| `GET` | `/persoquete/:idPerso` | Affiche le journal de quêtes | Joueur |
| `PATCH` | `/persoquete/journal/reussir/:id` | Valide une quête | Joueur |
| `PATCH` | `/persoquete/journal/echouer/:id` | Échoue une quête | Joueur |
| `DELETE`| `/persoquete/journal/abandonner/:id`| Abandonne une quête | Joueur |
| `GET` | `/inventaire/:idPerso` | Récupère l'inventaire | Joueur |
| `POST` | `/inventaire/ajouter` | Ajoute un objet à l'inventaire | Joueur |
| `DELETE`| `/inventaire/retirer` | Retire un objet de l'inventaire | Joueur |


👤 Auteurs

    Clément Laflamme
    Francis Boisvert
    Mathieu Gosselin
    Pascale Mercier
