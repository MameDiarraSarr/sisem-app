export interface Patient {
  id: number;
  prenom: string;
  nom: string;
  dateNaissance: string;
  age: number;
  sexe: 'M' | 'F' | '';
  telephone: string;
  email: string | null;
  adresse: string;
  ville: string;
  numeroDossier: string;
  typePatient: 'interne' | 'externe';
  pavillon: string | null;
  dateEnregistrement: string;
}