export interface Bulletin {
  id: number;
  numeroLabo: string;
  patientNom: string;
  pavillon: string | null;       // pavillon du patient (pour filtrer le major)
  examenId: number;
  nomExamen: string;
  indication: string;
  traitementEnCours: string | null;
  medecinPrescripteurId: number | null;
  dateEnregistrement: string;
  statut: 'enregistre' | 'saisi' | 'valide';
}