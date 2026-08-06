export interface Patient {
  id: number;
  numero_dossier: string | null;
  prenom: string;
  nom: string;
  date_naissance: string | null;
  age: string;              // l'API renvoie une chaîne : "8 ans", "5 mois"
  sexe: 'M' | 'F' | null;
  telephone: string;
  email: string | null;
  adresse: string | null;
  ville: string | null;
  type_patient: 'interne' | 'externe';
  pavillon: string | null;   // nom du pavillon (via hospitalisation active)
  pavillon_id: number | null;
  date_enregistrement: string;
}