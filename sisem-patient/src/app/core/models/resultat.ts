export interface AnalyseResultat {
  nom: string;
  valeur: string;
  unite: string;
  valeurReference: string;
}

export interface ResultatPatient {
  id: number;
  patientId: number;
  numeroLabo: string;
  examenNom: string;
  medecinPrescripteur: string | null;  // nom affiché (le backend le résoudra depuis l'id)
  dateResultat: string;
  statut: 'valide';
  analyses: AnalyseResultat[];
  commentaire: string;
}