export interface Monstre {
    id: string;
    nom: string;
    pointsDeVie: number;
    attaque: number;
    defense: number;
    typeMonstre: string | null;
    grandeur: string | null;
    alignement: string | null;
    imageUrl: string | null;
}


export interface ReponseListeMonstres {
    resultats: Monstre[];
}

export interface ReponseListeMonstresApi {
    resultats: MonstreApi[];
}



export interface ReponseUtilisateur {
        id: string;
        pseudo: string;
        avatarUrl: string;
    };

export interface MonstreApi {
    index: string;
    name: string;
    hit_points: number;
    image: string | null;
}