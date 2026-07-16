import axios from "axios";

const test = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
  validateStatus: () => true,
});

// Variables globales pour les tests
let tokenAdmin: string | null = null;
let tokenJoueur: string | null = null;
let tokenAutreJoueur: string | null = null; // Ajout pour les tests de sécurité

let uuidUser: string | undefined;
let uuidPerso: string | undefined;
let uuidQuete: string | undefined;
let uuidJoueur: string | undefined;

/* =========================================
   REQUÊTES AUTHENTIFICATION
   ========================================= */

// Test 1 : Créer un compte Admin
try {
  const res = await test.post("/auth/register", {
    email: "admin@maxremi.com",
    pseudo: "AllSeeingEye",
    mdp: "MdP123456!lol",
    codeAdmin: "AdminTest123",
  });
  if (res.status !== 201) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 1 réussi ! ✅");
} catch (error) {
  console.error("Test 1 échoué ❌ : " + error);
}

// Test 2 : Créer un compte comme utilisateur
try {
  const res = await test.post("/auth/register", {
    email: "math_le_barbare@waaagh.com",
    pseudo: "DakkaBoii",
    mdp: "WaaAgh247!",
  });
  if (res.status !== 201) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 2 réussi ! ✅");
} catch (error) {
  console.error("Test 2 échoué ❌ : " + error);
}

// Test 2.bis : Créer un autre compte utilisateur pour les tests de sécurité
try {
  const res = await test.post("/auth/register", {
    email: "voleur_sournois@waaagh.com",
    pseudo: "SneakyBoii",
    mdp: "SneakSnik247!",
  });
  if (res.status !== 201) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 2.bis réussi ! ✅");
} catch (error) {
  console.error("Test 2.bis échoué ❌ : " + error);
}

// Test 3 : Login dans un compte Admin avec infos OK
try {
  const res = await test.post("/auth/login", {
    email: "admin@maxremi.com",
    mdp: "MdP123456!lol",
  });
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  tokenAdmin = res.data.token;
  console.log("Test 3 réussi ! ✅");
} catch (error) {
  console.error("Test 3 échoué ❌ : " + error);
}

// Test 4 : Login dans un compte comme utilisateur avec infos OK
try {
  const res = await test.post("/auth/login", {
    email: "math_le_barbare@waaagh.com",
    mdp: "WaaAgh247!",
  });
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  tokenJoueur = res.data.token;
  console.log("Test 4 réussi ! ✅");
} catch (error) {
  console.error("Test 4 échoué ❌ : " + error);
}

// Test 4.bis : Login du deuxième utilisateur
try {
  const res = await test.post("/auth/login", {
    email: "voleur_sournois@waaagh.com",
    mdp: "SneakSnik247!",
  });
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  tokenAutreJoueur = res.data.token;
  console.log("Test 4.bis réussi ! ✅");
} catch (error) {
  console.error("Test 4.bis échoué ❌ : " + error);
}

// Test 5 : Login dans un compte comme utilisateur avec un mauvais MDP
try {
  const res = await test.post("/auth/login", {
    email: "math_le_barbare@waaagh.com",
    mdp: "wAAaGH247!",
  });
  if (res.status !== 401) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 5 réussi ! ✅");
} catch (error) {
  console.error("Test 5 échoué ❌ : " + error);
}

// Test 6 : Login dans un compte comme utilisateur avec un mauvais pseudo
try {
  const res = await test.post("/auth/login", {
    email: "math_le_barbare@waagh.com",
    mdp: "WaaAgh247!",
  });
  if (res.status !== 401) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 6 réussi ! ✅");
} catch (error) {
  console.error("Test 6 échoué ❌ : " + error);
}

// Test 7 : Obtenir mes informations d'utilisateur
try {
  const res = await test.get("/auth/me", {
    headers: { Authorization: `Bearer ${tokenJoueur}` },
  });
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);

  // Sauvegarde l'ID du joueur connecté
  if (res.data && res.data.id) {
    uuidJoueur = res.data.id;
  }

  console.log("Test 7 réussi ! ✅");
} catch (error) {
  console.error("Test 7 échoué ❌ : " + error);
}

/* =========================================
   REQUÊTES MONSTRES
   ========================================= */

// Test 8 : Afficher tous les monstres (PUBLIC)
try {
  const res = await test.get("/monstre/");
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 8 réussi ! ✅");
} catch (error) {
  console.error("Test 8 échoué ❌ : " + error);
}

// Test 9 : Ajout de monstre goblin (MDJ)
try {
  const res = await test.post(
    "/monstre/ajouter/goblin",
    {},
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 201 && res.status !== 200)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 9 réussi ! ✅");
} catch (error) {
  console.error("Test 9 échoué ❌ : " + error);
}

// Test 10 : Ajout de monstre orc (MDJ)
try {
  const res = await test.post(
    "/monstre/ajouter/orc",
    {},
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 201 && res.status !== 200)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 10 réussi ! ✅");
} catch (error) {
  console.error("Test 10 échoué ❌ : " + error);
}

// Test 11 : Afficher 1 monstre par son nom (PUBLIC)
try {
  const res = await test.get("/monstre/goblin");
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 11 réussi ! ✅");
} catch (error) {
  console.error("Test 11 échoué ❌ : " + error);
}

// Test 12 : Suppression de monstre par nom (MDJ)
try {
  const res = await test.delete("/monstre/supprimer/orc", {
    headers: { Authorization: `Bearer ${tokenAdmin}` },
  });
  if (res.status !== 200 && res.status !== 204)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 12 réussi ! ✅");
} catch (error) {
  console.error("Test 12 échoué ❌ : " + error);
}

// Test 13 : Modification du monstre goblin (MDJ)
try {
  const res = await test.patch(
    "/monstre/goblin",
    {
      nom: "Goblin ++",
      attaque: 50,
    },
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 13 réussi ! ✅");
} catch (error) {
  console.error("Test 13 échoué ❌ : " + error);
}

// Test 14 : Suppression du nouveau monstre (MDJ)
try {
  const res = await test.delete("/monstre/supprimer/goblin%20++", {
    headers: { Authorization: `Bearer ${tokenAdmin}` },
  });
  if (res.status !== 200 && res.status !== 204)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 14 réussi ! ✅");
} catch (error) {
  console.error("Test 14 échoué ❌ : " + error);
}

/* =========================================
   REQUÊTES OBJETS
   ========================================= */

// Test 15 : Creer 1 objet (MDJ)
try {
  const res = await test.post(
    "/objet/creer",
    {
      nom: "Baton",
      rarete: "RARE",
    },
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 201 && res.status !== 200)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 15 réussi ! ✅");
} catch (error) {
  console.error("Test 15 échoué ❌ : " + error);
}

// Test 16 : Afficher tous les objets (PUBLIC)
try {
  const res = await test.get("/objet/");
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 16 réussi ! ✅");
} catch (error) {
  console.error("Test 16 échoué ❌ : " + error);
}

// Test 17 : afficher 1 objet par son nom (PUBLIC)
try {
  const res = await test.get("/objet/baton");
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 17 réussi ! ✅");
} catch (error) {
  console.error("Test 17 échoué ❌ : " + error);
}

// Test 19 : Modification du objet par nom (MDJ)
try {
  const res = await test.patch(
    "/objet/baton",
    {
      nom: "Baton Legendaire",
      rarete: "LEGENDAIRE",
    },
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 19 réussi ! ✅");
} catch (error) {
  console.error("Test 19 échoué ❌ : " + error);
}

// Test 20 : Suppression de l'objet modifié (MDJ)
try {
  const res = await test.delete("/objet/supprimer/baton%20Legendaire", {
    headers: { Authorization: `Bearer ${tokenAdmin}` },
  });
  if (res.status !== 200 && res.status !== 204)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 20 réussi ! ✅");
} catch (error) {
  console.error("Test 20 échoué ❌ : " + error);
}

// Test 15.bis : Recréer l'objet pour les tests d'inventaire
try {
  const res = await test.post(
    "/objet/creer",
    {
      nom: "Baton",
      rarete: "RARE",
    },
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 201 && res.status !== 200)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 15.bis (Recréation) réussi ! ✅");
} catch (error) {
  console.error("Test 15.bis échoué ❌ : " + error);
}

/* =========================================
   REQUÊTES QUÊTES
   ========================================= */

// Test 21 : Creer 1 quete (MDJ)
try {
  const res = await test.post(
    "/quete/creer",
    {
      nom: "Aller chercher le baton",
      difficulte: "FACILE",
      recompense: 100,
    },
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 201 && res.status !== 200)
    throw new Error(`Status inattendu: ${res.status}`);
  if (res.data && res.data.id) uuidQuete = res.data.id;
  console.log("Test 21 réussi ! ✅");
} catch (error) {
  console.error("Test 21 échoué ❌ : " + error);
}

// Test 22 : Creer 2e quete (MDJ)
try {
  const res = await test.post(
    "/quete/creer",
    {
      nom: "Vaincre Grok",
      difficulte: "DIFFICILE",
      recompense: 150,
    },
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 201 && res.status !== 200)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 22 réussi ! ✅");
} catch (error) {
  console.error("Test 22 échoué ❌ : " + error);
}

// Test 23 : Afficher tous les quetes (PUBLIC)
try {
  const res = await test.get("/quete");
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 23 réussi ! ✅");
} catch (error) {
  console.error("Test 23 échoué ❌ : " + error);
}

// Test 24 : Afficher tous les quetes par difficulte (PUBLIC)
try {
  const res = await test.get("/quete?difficulte=difficile");
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 24 réussi ! ✅");
} catch (error) {
  console.error("Test 24 échoué ❌ : " + error);
}

// Test 25 : afficher 1 quete par son nom (PUBLIC)
try {
  const res = await test.get("/quete/Aller%20chercher%20le%20baton");
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 25 réussi ! ✅");
} catch (error) {
  console.error("Test 25 échoué ❌ : " + error);
}

// Test 27 : Modification de quete par nom (MDJ)
try {
  const res = await test.patch(
    "/quete/Aller%20chercher%20le%20baton",
    {
      nom: "Aller chercher le baton ++",
      difficulte: "DIFFICILE",
      recompense: 1000,
    },
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 27 réussi ! ✅");
} catch (error) {
  console.error("Test 27 échoué ❌ : " + error);
}

// Test 26 : Suppression de quete par nom (MDJ)
try {
  const res = await test.delete(
    "/quete/supprimer/Aller%20chercher%20le%20baton%20++",
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 200 && res.status !== 204)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 26 réussi ! ✅");
} catch (error) {
  console.error("Test 26 échoué ❌ : " + error);
}

// Test 21.bis : Recréer la quête pour les tests de PersoQuete
try {
  const res = await test.post(
    "/quete/creer",
    {
      nom: "Aller chercher le baton",
      difficulte: "FACILE",
      recompense: 100,
    },
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 201 && res.status !== 200)
    throw new Error(`Status inattendu: ${res.status}`);
  if (res.data && res.data.id) uuidQuete = res.data.id;
  console.log("Test 21.bis (Recréation) réussi ! ✅");
} catch (error) {
  console.error("Test 21.bis échoué ❌ : " + error);
}

/* =========================================
   REQUÊTES UTILISATEURS
   ========================================= */

// Test 28 : Créer un utilisateur (MDJ)
try {
  const res = await test.post(
    "/utilisateur/creer",
    {
      email: "test-utilisateur@gmail.com",
      pseudo: "test-utilisateur",
      mdp: "mdp-test-utilisateur",
    },
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 201 && res.status !== 200)
    throw new Error(`Status inattendu: ${res.status}`);
  if (res.data && res.data.id) uuidUser = res.data.id;
  console.log("Test 28 réussi ! ✅");
} catch (error) {
  console.error("Test 28 échoué ❌ : " + error);
}

// Test 29 : Récupérer l'information d'un utilisateur (MDJ)
try {
  const res = await test.get(`/utilisateur/recuperer/${uuidUser}`, {
    headers: { Authorization: `Bearer ${tokenAdmin}` },
  });
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 29 réussi ! ✅");
} catch (error) {
  console.error("Test 29 échoué ❌ : " + error);
}

// Test 30 : Mettre à jour un utilisateur (MDJ)
try {
  const res = await test.patch(
    `/utilisateur/modifier/${uuidUser}`,
    {
      email: "test-utilisateur2@gmail.com",
      pseudo: "test-utilisateur2",
      mdp: "mdp-test-utilisateur2",
    },
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 30 réussi ! ✅");
} catch (error) {
  console.error("Test 30 échoué ❌ : " + error);
}

// Test 31 : Supprimer un utilisateur (MDJ)
try {
  const res = await test.delete(`/utilisateur/supprimer/${uuidUser}`, {
    headers: { Authorization: `Bearer ${tokenAdmin}` },
  });
  if (res.status !== 200 && res.status !== 204)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 31 réussi ! ✅");
} catch (error) {
  console.error("Test 31 échoué ❌ : " + error);
}

// Test 28.bis : Recréer l'utilisateur pour les tests de personnages
try {
  const res = await test.post(
    "/utilisateur/creer",
    {
      email: "test-utilisateur@gmail.com",
      pseudo: "test-utilisateur",
      mdp: "mdp-test-utilisateur",
    },
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 201 && res.status !== 200)
    throw new Error(`Status inattendu: ${res.status}`);
  if (res.data && res.data.id) uuidUser = res.data.id;
  console.log("Test 28.bis (Recréation) réussi ! ✅");
} catch (error) {
  console.error("Test 28.bis échoué ❌ : " + error);
}

/* =========================================
   REQUÊTES PERSONNAGES
   ========================================= */

// Test 32 : Créer un personnage (JOUEUR)
try {
  const res = await test.post("/personnage/creer", {
    nom: "Gandalf",
    classe: "MAGE",
    idUtilisateur: uuidJoueur, 
  }, {
    headers: { Authorization: `Bearer ${tokenJoueur}` },
  });
  if (res.status !== 201 && res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  if (res.data && res.data.id) uuidPerso = res.data.id;
  console.log("Test 32 réussi ! ✅");
} catch (error) {
  console.error("Test 32 échoué ❌ : " + error);
}

// Test 33 : Récupérer l'information d'un personnage (JOUEUR)
try {
  const res = await test.get(`/personnage/recuperer/${uuidPerso}`, {
    headers: { Authorization: `Bearer ${tokenJoueur}` },
  });
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 33 réussi ! ✅");
} catch (error) {
  console.error("Test 33 échoué ❌ : " + error);
}

// Test 33.a : Un autre utilisateur essaie de récupérer un personnage qui n'est pas à lui (Refus)
try {
  const res = await test.get(`/personnage/recuperer/${uuidPerso}`, {
    headers: { Authorization: `Bearer ${tokenAutreJoueur}` },
  });
  if (res.status !== 403)
    throw new Error(`Status inattendu (403 attendu): ${res.status}`);
  console.log("Test 33.a réussi ! ✅");
} catch (error) {
  console.error("Test 33.a échoué ❌ : " + error);
}

// Test 33.b : Un autre utilisateur essaie de supprimer un personnage qui n'est pas à lui (Refus)
try {
  const res = await test.delete(`/personnage/supprimer/${uuidPerso}`, {
    headers: { Authorization: `Bearer ${tokenAutreJoueur}` },
  });
  if (res.status !== 403)
    throw new Error(`Status inattendu (403 attendu): ${res.status}`);
  console.log("Test 33.b réussi ! ✅");
} catch (error) {
  console.error("Test 33.b échoué ❌ : " + error);
}

// Test 33.c : Un admin (maitre_du_jeu) récupère un personnage qui n'est pas à lui (Succès)
try {
  const res = await test.get(`/personnage/recuperer/${uuidPerso}`, {
    headers: { Authorization: `Bearer ${tokenAdmin}` },
  });
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 33.c réussi ! ✅");
} catch (error) {
  console.error("Test 33.c échoué ❌ : " + error);
}

// Test 34 : Mettre à jour un personnage (MDJ)
try {
  const res = await test.patch(
    `/personnage/modifier/${uuidPerso}`,
    {
      nom: "Donkey Kong",
      classe: "GUERRIER",
      piecesDOr: 1000,
    },
    {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    },
  );
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 34 réussi ! ✅");
} catch (error) {
  console.error("Test 34 échoué ❌ : " + error);
}

// Test 35 : Supprimer un personnage (JOUEUR)
try {
  const res = await test.delete(`/personnage/supprimer/${uuidPerso}`, {
    headers: { Authorization: `Bearer ${tokenJoueur}` },
  });
  if (res.status !== 200 && res.status !== 204)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 35 réussi ! ✅");
} catch (error) {
  console.error("Test 35 échoué ❌ : " + error);
}

// Test 32.bis : Recréer un personnage pour l'inventaire et les quêtes
try {
  const res = await test.post(
    "/personnage/creer",
    {
      nom: "Gandalf",
      classe: "MAGE",
      idUtilisateur: uuidJoueur,
    },
    {
      headers: { Authorization: `Bearer ${tokenJoueur}` },
    },
  );
  if (res.status !== 201 && res.status !== 200)
    throw new Error(`Status inattendu: ${res.status}`);
  if (res.data && res.data.id) uuidPerso = res.data.id;
  console.log("Test 32.bis (Recréation) réussi ! ✅");
} catch (error) {
  console.error("Test 32.bis échoué ❌ : " + error);
}

/* =========================================
   PERSOQUETE - JOURNAL DE QUÊTES
   ========================================= */

// Test 36 : Ajouter une quete a la table intermediaire (JOUEUR)
try {
  const res = await test.post(
    "/persoquete/ajouter",
    {
      idPerso: uuidPerso,
      idQuete: uuidQuete,
    },
    {
      headers: { Authorization: `Bearer ${tokenJoueur}` },
    },
  );
  if (res.status !== 201 && res.status !== 200)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 36 réussi ! ✅");
} catch (error) {
  console.error("Test 36 échoué ❌ : " + error);
}

// Test 37 : Voir le journal de quete d'un personnage (JOUEUR)
try {
  const res = await test.get(`/persoquete/${uuidPerso}`, {
    headers: { Authorization: `Bearer ${tokenJoueur}` },
  });
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 37 réussi ! ✅");
} catch (error) {
  console.error("Test 37 échoué ❌ : " + error);
}

/* =========================================
   REQUÊTES INVENTAIRE
   ========================================= */

// Test 38 : Récupérer l'inventaire d'un personnage - Succès (JOUEUR)
try {
  const res = await test.get(`/inventaire/${uuidPerso}`, {
    headers: { Authorization: `Bearer ${tokenJoueur}` },
  });
  if (res.status !== 200) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 38 réussi ! ✅");
} catch (error) {
  console.error("Test 38 échoué ❌ : " + error);
}

// Test 39 : Récupérer l'inventaire avec un UUID invalide - Doit retourner 400 (JOUEUR)
try {
  const res = await test.get("/inventaire/un-id-invalide-1234", {
    headers: { Authorization: `Bearer ${tokenJoueur}` },
  });
  if (res.status !== 400) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 39 réussi ! ✅");
} catch (error) {
  console.error("Test 39 échoué ❌ : " + error);
}

// Test 40 : Ajouter un objet à l'inventaire - Succès (JOUEUR)
try {
  const res = await test.post(
    "/inventaire/ajouter",
    {
      personnageId: uuidPerso,
      nomObjet: "Baton",
    },
    {
      headers: { Authorization: `Bearer ${tokenJoueur}` },
    },
  );
  if (res.status !== 201 && res.status !== 200)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 40 réussi ! ✅");
} catch (error) {
  console.error("Test 40 échoué ❌ : " + error);
}

// Test 41 : Ajouter un objet : Erreur Doublon - Doit retourner 500 (JOUEUR)
try {
  const res = await test.post(
    "/inventaire/ajouter",
    {
      personnageId: uuidPerso,
      nomObjet: "Baton",
    },
    {
      headers: { Authorization: `Bearer ${tokenJoueur}` },
    },
  );
  if (res.status !== 500) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 41 réussi ! ✅");
} catch (error) {
  console.error("Test 41 échoué ❌ : " + error);
}

// Test 42 : Ajouter un objet : Erreur champs manquants - Doit retourner 400 (JOUEUR)
try {
  const res = await test.post(
    "/inventaire/ajouter",
    {
      personnageId: uuidPerso,
    },
    {
      headers: { Authorization: `Bearer ${tokenJoueur}` },
    },
  );
  if (res.status !== 400) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 42 réussi ! ✅");
} catch (error) {
  console.error("Test 42 échoué ❌ : " + error);
}

// Test 43 : Ajouter un objet : L'objet n'existe pas - Doit retourner 404 (JOUEUR)
try {
  const res = await test.post(
    "/inventaire/ajouter",
    {
      personnageId: uuidPerso,
      nomObjet: "ObjetImaginaireQuiNExistePas",
    },
    {
      headers: { Authorization: `Bearer ${tokenJoueur}` },
    },
  );
  if (res.status !== 404) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 43 réussi ! ✅");
} catch (error) {
  console.error("Test 43 échoué ❌ : " + error);
}

// Test 44 : Retirer un objet de l'inventaire - Succès (JOUEUR)
try {
  const res = await test.delete("/inventaire/retirer", {
    headers: { Authorization: `Bearer ${tokenJoueur}` },
    data: {
      personnageId: uuidPerso,
      nomObjet: "Baton",
    },
  });
  if (res.status !== 200 && res.status !== 204)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 44 réussi ! ✅");
} catch (error) {
  console.error("Test 44 échoué ❌ : " + error);
}

// Test 45 : Retirer un objet : Le personnage ne le possède plus - Doit retourner 404 (JOUEUR)
try {
  const res = await test.delete("/inventaire/retirer", {
    headers: { Authorization: `Bearer ${tokenJoueur}` },
    data: {
      personnageId: uuidPerso,
      nomObjet: "Baton",
    },
  });
  if (res.status !== 404) throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 45 réussi ! ✅");
} catch (error) {
  console.error("Test 45 échoué ❌ : " + error);
}

// Test 46 : Un admin (maitre_du_jeu) supprime un personnage qui n'est pas à lui (Succès)
// Ce test doit être mis à la toute fin pour ne pas briser les tests d'inventaire et de quêtes
try {
  const res = await test.delete(`/personnage/supprimer/${uuidPerso}`, {
    headers: { Authorization: `Bearer ${tokenAdmin}` },
  });
  if (res.status !== 200 && res.status !== 204)
    throw new Error(`Status inattendu: ${res.status}`);
  console.log("Test 46 réussi ! ✅");
} catch (error) {
  console.error("Test 46 échoué ❌ : " + error);
}
