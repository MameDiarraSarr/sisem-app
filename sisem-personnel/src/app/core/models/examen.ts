// Une analyse de référence (ex: Hémoglobine, avec sa norme)
export interface AnalyseReference {
  nom: string;
  unite: string;
  valeurReference: string;
}

// Un examen du catalogue (ex: Hémogramme) et ses analyses
export interface Examen {
  id: number;
  nom: string;
  analyses: AnalyseReference[];
}