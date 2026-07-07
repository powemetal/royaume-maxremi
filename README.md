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


👤 Auteurs

    Clément Laflamme
    Francis Boisvert
    Mathieu Gosselin
    Pascale Mercier