export interface MembrePersonnel {
  id: number;
  matricule: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  role: 'secretaire' | 'technicien' | 'biologiste' | 'major' | 'medecin' | 'admin';
  pavillon: string | null;      // nom du pavillon
  pavillon_id: number | null;   // id, pour les formulaires
  statut: 'actif' | 'inactif';
}