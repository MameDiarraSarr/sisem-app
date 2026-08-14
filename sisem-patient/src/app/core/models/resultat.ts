export interface AnalyseResultat {
  nom: string;
  valeur: string;
  unite: string;
  valeurReference: string;
}

// Un examen dans la feuille : son nom + ses analyses
export interface ExamenResultat {
  examenNom: string;
  analyses: AnalyseResultat[];
}

export interface ResultatPatient {
  id: number;                            // id du bulletin
  patientId: number;
  numeroDossier: string | null;          // code patient
  numeroLabo: string;
  sexe: string | null;
  age: string | null;
  adresse: string | null;
  medecinPrescripteur: string | null;
  dateResultat: string;
  statut: 'valide';
  commentaire: string;
  examens: ExamenResultat[];             // tous les examens du bulletin (la feuille)
}