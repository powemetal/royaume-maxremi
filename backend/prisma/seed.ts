import prisma from "../src/utils/prisma.js";
import bcrypt from "bcryptjs";

await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Inventaire" CASCADE`);
await prisma.$executeRawUnsafe(`TRUNCATE TABLE "PersoQuete" CASCADE`);
await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Quete" CASCADE`);
await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Personnage" CASCADE`);
await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Utilisateur" CASCADE`);
await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Objet" CASCADE`);

async function main() {

  
// -----------------------------
// 1. UTILISATEURS
// -----------------------------

// Noms réels → pour l’email
const userRealNames = [
  "Alexandre Dupuis",
  "Mélanie Gagnon",
  "Samuel Tremblay",
  "Élodie Martel",
  "Jonathan Boucher",
  "Camille Lavoie",
  "Patrick Desrosiers",
  "Sabrina Fortin",
  "Mathieu Leblanc",
  "Isabelle Côté"
];

// Pseudos gamer → pour le pseudo
const gamerPseudos = [
  "ShadowWolf",
  "NightBlade",
  "CrimsonFury",
  "ArcaneNova",
  "IronClaw",
  "SilentSpecter",
  "StormRider",
  "FrostViper",
  "VoidRunner",
  "SolarStrike"
];

const users = [];

for (let i = 0; i < userRealNames.length; i++) {
  const realName = userRealNames[i];
  const firstName = realName.split(" ")[0].toLowerCase(); // pour l'email
  const pseudo = gamerPseudos[i] as string; // pseudo gamer

  const user = await prisma.utilisateur.create({
    data: {
      email: `${firstName}@royaume.com`,
      pseudo: pseudo,
      mdp: await bcrypt.hash("Password123!", 10),
    },
  });

  users.push(user);
}


  // -----------------------------
  // 2. OBJETS
  // -----------------------------
  const objetsData = [
    // ARMES
    { nom: "Épée longue", rarete: "COMMUN", tType: "ARME", att: 6, prix: 15, typeDegats: "TRANCHANT", description: "Épée polyvalente utilisée par les soldats." },
    { nom: "Hache de bataille", rarete: "COMMUN", tType: "ARME", att: 7, prix: 10, typeDegats: "TRANCHANT" },
    { nom: "Marteau de guerre", rarete: "COMMUN", tType: "ARME", att: 8, prix: 12, typeDegats: "CONTONDANT" },
    { nom: "Arc long", rarete: "COMMUN", tType: "ARME", att: 6, prix: 50, typeDegats: "PERCANT" },
    { nom: "Arc court", rarete: "COMMUN", tType: "ARME", att: 4, prix: 25, typeDegats: "PERCANT" },
    { nom: "Dague", rarete: "COMMUN", tType: "ARME", att: 3, prix: 2, typeDegats: "TRANCHANT" },
    { nom: "Fléau", rarete: "COMMUN", tType: "ARME", att: 7, prix: 10, typeDegats: "CONTONDANT" },
    { nom: "Lance", rarete: "COMMUN", tType: "ARME", att: 5, prix: 1, typeDegats: "PERCANT" },
    { nom: "Hallebarde", rarete: "COMMUN", tType: "ARME_2_MAINS", att: 9, prix: 20, typeDegats: "TRANCHANT" },
    { nom: "Glaive", rarete: "COMMUN", tType: "ARME_2_MAINS", att: 8, prix: 18, typeDegats: "TRANCHANT" },

    // ARMURES
    { nom: "Armure de cuir", rarete: "COMMUN", tType: "ARMURE", def: 11, prix: 10 },
    { nom: "Armure de cuir clouté", rarete: "COMMUN", tType: "ARMURE", def: 12, prix: 45 },
    { nom: "Armure de plates", rarete: "RARE", tType: "ARMURE", def: 18, prix: 1500 },
    { nom: "Cotte de mailles", rarete: "COMMUN", tType: "ARMURE", def: 16, prix: 75 },
    { nom: "Bouclier", rarete: "COMMUN", tType: "BOUCLIER", def: 2, prix: 10 },

    // POTIONS
    { nom: "Potion de soin", rarete: "COMMUN", tType: "POTION", prix: 50, description: "Restaure une petite quantité de vitalité." },
    { nom: "Potion de soin supérieure", rarete: "PEU_COMMUN", tType: "POTION", prix: 150 },
    { nom: "Potion de force de géant", rarete: "RARE", tType: "POTION", prix: 300 },
    { nom: "Potion d'invisibilité", rarete: "RARE", tType: "POTION", prix: 500 },

    // OUTILS
    { nom: "Kit d'herboriste", rarete: "COMMUN", tType: "OUTIL", prix: 5 },
    { nom: "Kit de voleur", rarete: "COMMUN", tType: "OUTIL", prix: 25 },
    { nom: "Kit d'alchimiste", rarete: "PEU_COMMUN", tType: "OUTIL", prix: 50 },
    { nom: "Kit de calligraphie", rarete: "COMMUN", tType: "OUTIL", prix: 10 },

    // MARCHANDISES
    { nom: "Lingot de fer", rarete: "COMMUN", tType: "MARCHANDISE", prix: 3 },
    { nom: "Lingot d'argent", rarete: "PEU_COMMUN", tType: "MARCHANDISE", prix: 25 },
    { nom: "Lingot d'or", rarete: "RARE", tType: "MARCHANDISE", prix: 50 },

    // SACS / CONTENEURS
    { nom: "Sac à dos", rarete: "COMMUN", tType: "SAC", prix: 2 },
    { nom: "Petit sac", rarete: "COMMUN", tType: "SAC", prix: 1 },
    { nom: "Bourse", rarete: "COMMUN", tType: "SAC", prix: 1 },
    { nom: "Coffre en bois", rarete: "COMMUN", tType: "CONTENEUR", prix: 5 },

    // BIJOUX
    { nom: "Anneau en argent", rarete: "COMMUN", tType: "BIJOU", prix: 10 },
    { nom: "Collier en or", rarete: "PEU_COMMUN", tType: "BIJOU", prix: 50 },
    { nom: "Bracelet en cuivre", rarete: "COMMUN", tType: "BIJOU", prix: 5 },

    // TRINKETS
    { nom: "Pierre gravée", rarete: "COMMUN", tType: "TRINKET", prix: 1 },
    { nom: "Petit totem en bois", rarete: "COMMUN", tType: "TRINKET", prix: 2 },
    { nom: "Médaillon ancien", rarete: "PEU_COMMUN", tType: "TRINKET", prix: 15 },

    // PARCHEMINS
    { nom: "Parchemin de lumière", rarete: "COMMUN", tType: "PARCHEMIN", prix: 25 },
    { nom: "Parchemin de protection", rarete: "PEU_COMMUN", tType: "PARCHEMIN", prix: 75 },
    { nom: "Parchemin de détection magique", rarete: "COMMUN", tType: "PARCHEMIN", prix: 50 },

    // BAGUETTES / FOCALISATEURS / BÂTONS
    { nom: "Baguette de feu", rarete: "RARE", tType: "BAGUETTE", prix: 500 },
    { nom: "Baguette de glace", rarete: "RARE", tType: "BAGUETTE", prix: 500 },
    { nom: "Focalisateur arcanique", rarete: "COMMUN", tType: "FOCALISATEUR", prix: 10 },
    { nom: "Bâton de chêne", rarete: "COMMUN", tType: "BATON", prix: 5 },

    // BOTTES / GANTS / CAPES / CASQUES
    { nom: "Bottes de cuir", rarete: "COMMUN", tType: "BOTTES", prix: 5 },
    { nom: "Gants de cuir", rarete: "COMMUN", tType: "GANT", prix: 2 },
    { nom: "Cape de voyage", rarete: "COMMUN", tType: "CAPE", prix: 3 },
    { nom: "Casque de fer", rarete: "COMMUN", tType: "CASQUE", prix: 10 },

    // OBJETS UTILITAIRES
    { nom: "Torche", rarete: "COMMUN", tType: "AUTRE", prix: 1 },
    { nom: "Rations de voyage", rarete: "COMMUN", tType: "AUTRE", prix: 5 },
    { nom: "Corde de chanvre (15m)", rarete: "COMMUN", tType: "AUTRE", prix: 1 },
    { nom: "Marteau de forgeron", rarete: "COMMUN", tType: "OUTIL", prix: 2 },
    { nom: "Piton", rarete: "COMMUN", tType: "AUTRE", prix: 1 },
    { nom: "Lampe à huile", rarete: "COMMUN", tType: "AUTRE", prix: 5 },
    { nom: "Huile (flasque)", rarete: "COMMUN", tType: "AUTRE", prix: 1 },
    { nom: "Couverture", rarete: "COMMUN", tType: "AUTRE", prix: 5 },
    { nom: "Bouteille en verre", rarete: "COMMUN", tType: "AUTRE", prix: 2 },
    { nom: "Tente", rarete: "COMMUN", tType: "AUTRE", prix: 10 },
    { nom: "Grappin", rarete: "COMMUN", tType: "AUTRE", prix: 2 },
    { nom: "Sifflet", rarete: "COMMUN", tType: "AUTRE", prix: 1 },
    { nom: "Carnet de notes", rarete: "COMMUN", tType: "AUTRE", prix: 2 },
    { nom: "Plume et encre", rarete: "COMMUN", tType: "AUTRE", prix: 1 },
    { nom: "Trousse de soins", rarete: "COMMUN", tType: "OUTIL", prix: 5 },
    { nom: "Cadenas", rarete: "COMMUN", tType: "AUTRE", prix: 10 },
    { nom: "Pelle", rarete: "COMMUN", tType: "OUTIL", prix: 2 },
    { nom: "Poche à eau", rarete: "COMMUN", tType: "AUTRE", prix: 1 },
    { nom: "Sablier", rarete: "COMMUN", tType: "AUTRE", prix: 25 },
    { nom: "Trousse de messager", rarete: "COMMUN", tType: "AUTRE", prix: 5 },
    { nom: "Trousse de cuisinier", rarete: "COMMUN", tType: "OUTIL", prix: 1 },
    { nom: "Trousse de menuisier", rarete: "COMMUN", tType: "OUTIL", prix: 8 },
    { nom: "Trousse de maçon", rarete: "COMMUN", tType: "OUTIL", prix: 10 },
    { nom: "Trousse de brasseur", rarete: "COMMUN", tType: "OUTIL", prix: 5 },
    { nom: "Trousse de tanneur", rarete: "COMMUN", tType: "OUTIL", prix: 5 },
    { nom: "Trousse de peintre", rarete: "COMMUN", tType: "OUTIL", prix: 10 },
    { nom: "Trousse de sculpteur", rarete: "COMMUN", tType: "OUTIL", prix: 8 },
    { nom: "Trousse de potier", rarete: "COMMUN", tType: "OUTIL", prix: 4 },
    { nom: "Trousse de pêche", rarete: "COMMUN", tType: "OUTIL", prix: 1 },
    { nom: "Trousse de navigation", rarete: "PEU_COMMUN", tType: "OUTIL", prix: 25 },
  ];

  const objets = [];
  for (const obj of objetsData) {
    const o = await prisma.objet.create({ data: obj });
    objets.push(o);
  }

  // -----------------------------
  // 3. PERSONNAGES
  // -----------------------------

  // -----------------------------
// 3. PERSONNAGES
// -----------------------------

// 4 noms par utilisateur → 40 noms total → aucun doublon
const persoNamesParUser = [
  ["Tharion", "Lyra", "Bromir", "Selene"],
  ["Kaelis", "Dorian", "Mira", "Fenwick"],
  ["Aldren", "Ysolde", "Roderick", "Elowen"],
  ["Garruk", "Seraphine", "Torvald", "Nimra"],
  ["Vaelis", "Orin", "Kassandra", "Lorian"],
  ["Eryndor", "Sylwen", "Kaelor", "Varyn"],
  ["Ismira", "Thalios", "Meridia", "Korven"],
  ["Selyndra", "Faelor", "Ravion", "Teryn"],
  ["Malwen", "Odrin", "Valira", "Kyrion"],
  ["Sarn", "Elira", "Torwyn", "Myrren"]
];

const classes = ["GUERRIER", "MAGE", "VOLEUR", "CLERC"];
const personnages = [];

for (let u = 0; u < users.length; u++) {
  const user = users[u];
  const noms = persoNamesParUser[u]; // les 4 noms du user

  for (const nomPerso of noms) {
    const perso = await prisma.personnage.create({
      data: {
        nom: nomPerso,
        classe: classes[Math.floor(Math.random() * classes.length)],
        idUtilisateur: user.id,
        niveau: Math.floor(Math.random() * 4) + 1,
        piecesDOr: Math.floor(Math.random() * 200),
        pointsDeVie: 100,
      },
    });

    personnages.push(perso);
  }
}


  // -----------------------------
  // 4. INVENTAIRES
  // -----------------------------

  // Filtrage des objets par type
  const armes = objets.filter((o) => o.tType === "ARME" || o.tType === "ARME_2_MAINS");
  const armures = objets.filter((o) => o.tType === "ARMURE" || o.tType === "BOUCLIER");

  for (const perso of personnages) {
    // 1. Sélection obligatoire : 1 arme + 1 armure
    const armeObligatoire = armes[Math.floor(Math.random() * armes.length)];
    const armureObligatoire = armures[Math.floor(Math.random() * armures.length)];

    // Ajout de l'arme obligatoire
    await prisma.inventaire.create({
      data: {
        idObjet: armeObligatoire.id,
        idPersonnage: perso.id,
      },
    });

    // Ajout de l'armure obligatoire
    await prisma.inventaire.create({
      data: {
        idObjet: armureObligatoire.id,
        idPersonnage: perso.id,
      },
    });

    // 2. Ajout d'objets supplémentaires (6 à 13 objets)
    const nbObjets = Math.floor(Math.random() * 8) + 6;

    // Mélange des objets
    const objetsChoisis = objets.sort(() => Math.random() - 0.5).slice(0, nbObjets);

    // Ajout des objets supplémentaires
    for (const obj of objetsChoisis) {
      // Évite les doublons arme/armure déjà ajoutés
      if (obj.id === armeObligatoire.id || obj.id === armureObligatoire.id) continue;

      await prisma.inventaire.create({
        data: {
          idObjet: obj.id,
          idPersonnage: perso.id,
        },
      });
    }
  }

  // -----------------------------
  // 5. QUÊTES
  // -----------------------------
  const queteNames = ["Les Ruines de Valmorra", "Le Cri du Bois Sombre", "La Pierre des Anciens", "Le Pacte Brisé", "Les Larmes du Dragon", "La Tour des Murmures", "Le Marchand Disparu", "La Mine Abandonnée", "Le Rituel Interrompu", "La Route des Ombres", "Le Tombeau des Rois", "La Source Corrompue", "Le Portail Éteint", "La Marche des Revenants", "Le Cœur de la Forêt", "La Forteresse Oubliée", "Le Chant des Sirènes", "La Faille Lumineuse", "Le Messager Perdu", "La Couronne de Cendres", "Le Sceau du Nord", "La Grotte des Échos", "Le Serment du Guerrier", "La Lame du Crépuscule", "Le Refuge des Mages", "La Route des Brumes", "Le Temple des Trois Lunes", "La Confrérie du Vent", "Le Sang du Titan", "La Marche des Loups", "Le Voile de Minuit", "La Cité Enfouie", "Le Brasier Éternel", "La Chambre des Secrets", "Le Pont des Âmes", "La Danse des Flammes", "Le Jardin des Ombres", "La Cour des Mirages", "Le Souffle du Mont Gris", "La Mer de Verre", "Le Dernier Rempart", "La Clé du Destin", "Le Chant du Fer", "La Nuit des Mille Lanternes", "Le Labyrinthe de Sel", "La Marche des Géants", "Le Serment de l’Aube", "La Chambre des Murmures", "Le Désert des Murmures", "La Lance du Soleil", "Le Tribut des Sables", "La Forteresse des Vents", "Le Puits des Ancêtres", "La Marche des Exilés", "Le Voile de l’Oasis", "La Cité des Mille Colonnes", "Le Souffle du Scorpion", "La Route des Caravanes", "Le Pacte des Nomades", "La Couronne de l’Aurore", "Le Tombeau des Premiers Rois", "La Danse des Mirages", "Le Serment des Marcheurs", "La Nuit des Trois Lunes", "Le Passage des Titans", "La Grotte du Croissant", "Le Chant des Dunes", "La Porte de l’Horizon", "Le Brasier du Sud", "La Faille des Ancêtres", "Le Refuge des Errants", "La Spirale de Verre", "Le Sablier du Destin"];

  const quetes = [];
  for (let i = 0; i < queteNames.length; i++) {
    const q = await prisma.quete.create({
      data: {
        nom: queteNames[i],
        difficulte: ["FACILE", "MOYEN", "DIFFICILE", "LEGENDAIRE"][Math.floor(Math.random() * 4)],
        description: `Description de la quête : ${queteNames[i]}.`,
        recompense: Math.floor(Math.random() * 300) + 50,
      },
    });
    quetes.push(q);
  }

  // -----------------------------
  // 6. PersoQuetes réalistes
  // -----------------------------
  for (const perso of personnages) {
    const nbQuetes = Math.floor(Math.random() * 4) + 4;

    const quetesChoisies = quetes.sort(() => Math.random() - 0.5).slice(0, nbQuetes);

    for (const q of quetesChoisies) {
      await prisma.persoQuete.create({
        data: {
          idPersonnage: perso.id,
          idQuete: q.id,
          statut: ["DISPONIBLE", "EN_COURS", "TERMINE"][Math.floor(Math.random() * 3)],
        },
      });
    }
  }
}

main()
  .then(() => console.log("Seed terminée !"))
  .catch((e) => console.error(e))
  .finally(async () => prisma.$disconnect());
