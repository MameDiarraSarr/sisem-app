import { Injectable, signal } from '@angular/core';

export interface Patient {
  id: number;
  prenom: string;
  nom: string;
  telephone: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  patientConnecte = signal<Patient | null>(null);

  // ⚠️ Comptes patients de test — seront remplacés par le backend Laravel
  private comptesTest = [
    { id: 1, prenom: 'Amadou', nom: 'Diop', telephone: '771234567', motDePasse: 'test123' },
    { id: 2, prenom: 'Fatou', nom: 'Ndiaye', telephone: '772345678', motDePasse: 'test123' },
  ];

  // Connexion par téléphone + mot de passe
  connexion(telephone: string, motDePasse: string): boolean {
    const compte = this.comptesTest.find(
      c => c.telephone === telephone && c.motDePasse === motDePasse
    );

    if (compte) {
      this.patientConnecte.set({
        id: compte.id,
        prenom: compte.prenom,
        nom: compte.nom,
        telephone: compte.telephone,
      });
      return true;
    }
    return false;
  }

  deconnexion(): void {
    this.patientConnecte.set(null);
  }

  estConnecte(): boolean {
    return this.patientConnecte() !== null;
  }
}