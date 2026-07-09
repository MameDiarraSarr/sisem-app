export interface Patient {
  id: number;
  prenom: string;
  nom: string;
  age: number;
  numeroLabo: string;
  typePatient: 'interne' | 'externe';
  pavillon: string | null;   // null si externe
  dateEnregistrement: string;
}