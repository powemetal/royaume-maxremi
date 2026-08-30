export const valeursTypeMonstre = [
  "ABERRATION",
  "BETE",
  "CELESTIEL",
  "CONSTRUCTION",
  "DRAGON",
  "ELEMENTAIRE",
  "FEERIQUE",
  "FIELON",
  "GEANT",
  "HUMANOIDE",
  "MONSTRUOSITE",
  "VASE",
  "PLANTE",
  "MORT_VIVANT",
] as const;

export type TypeMonstre = typeof valeursTypeMonstre[number];


export const valeursGrosseur = [
  "TRES_PETIT",
  "PETIT",
  "MOYEN",
  "GRAND",
  "TRES_GRAND",
  "GIGANTESQUE",
] as const;

export type Grandeur = typeof valeursGrosseur[number];


export const valeursAlignement = [
  "NEUTRE",
  "NEUTRE_BON",
  "NEUTRE_MAUVAIS",
  "CHAOTIQUE_NEUTRE",
  "CHAOTIQUE_BON",
  "CHAOTIQUE_MAUVAIS",
  "LOYAL_NEUTRE",
  "LOYAL_BON",
  "LOYAL_MAUVAIS",
  "SANS_ALIGNEMENT",
] as const;

export type Alignement = typeof valeursAlignement[number];
