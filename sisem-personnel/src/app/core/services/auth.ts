import { Injectable, signal } from '@angular/core';

export interface Utilisateur {
  email: string;
  role: 'secretaire' | 'technicien' | 'biologiste' | 'major' | 'medecin' | 'admin';
  nom: string;
  pavillon?: string | null;   // pour le major (et médecin)
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  utilisateurConnecte = signal<Utilisateur | null>(null);

  // ⚠️ Comptes de test temporaires — à remplacer par le backend Laravel
  private comptesTest = [
    { email: 'secretaire@albertroyer.sn', motDePasse: 'test123', role: 'secretaire' as const, nom: 'Marième Fall', pavillon: null },
    { email: 'technicien@albertroyer.sn', motDePasse: 'test123', role: 'technicien' as const, nom: 'Ousmane Sow', pavillon: null },
    { email: 'biologiste@albertroyer.sn', motDePasse: 'test123', role: 'biologiste' as const, nom: 'Fatou Diallo', pavillon: null },
    { email: 'medecin@albertroyer.sn', motDePasse: 'test123', role: 'medecin' as const, nom: 'Dr. Aliou Ndiaye', pavillon: 'Pavillon M' },
    { email: 'major@albertroyer.sn', motDePasse: 'test123', role: 'major' as const, nom: 'Awa Sène', pavillon: 'Pavillon M' },
    { email: 'admin@albertroyer.sn', motDePasse: 'test123', role: 'admin' as const, nom: 'Awa Diop', pavillon: null },
  ];

  connexion(email: string, motDePasse: string): boolean {
    const compte = this.comptesTest.find(
      c => c.email === email && c.motDePasse === motDePasse
    );

    if (compte) {
      this.utilisateurConnecte.set({
        email: compte.email,
        role: compte.role,
        nom: compte.nom,
        pavillon: compte.pavillon,
      });
      return true;
    }
    return false;
  }

  deconnexion(): void {
    this.utilisateurConnecte.set(null);
  }

  estConnecte(): boolean {
    return this.utilisateurConnecte() !== null;
  }
}