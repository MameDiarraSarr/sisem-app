export interface AnalyseReference {
  id: number;
  nom_analyse: string;
  valeur_normale: string;
  unite: string | null;
}

export interface Examen {
  id: number;
  nom_examen: string;
  analyses: AnalyseReference[];
}