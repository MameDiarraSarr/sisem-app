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
  numeroLabo: string;
  medecinPrescripteur: string | null;
  dateResultat: string;
  statut: 'valide';
  commentaire: string;
  examens: ExamenResultat[];             // tous les examens du bulletin (la feuille)
}