export interface MembrePersonnel {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  role: 'secretaire' | 'technicien' | 'biologiste' | 'major' | 'medecin';
  pavillon: string | null;   // pour major/médecin
  statut: 'actif' | 'inactif';
}