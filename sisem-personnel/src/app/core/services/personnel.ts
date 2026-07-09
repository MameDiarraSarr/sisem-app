import { Injectable } from '@angular/core';
import { MembrePersonnel } from '../models/membre-personnel';

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {

  // ⚠️ Données fictives temporaires — seront remplacées par le backend Laravel
  private personnel: MembrePersonnel[] = [
    { id: 1, prenom: 'Marième', nom: 'Fall', email: 'secretaire@albertroyer.sn', telephone: '77 123 45 67', role: 'secretaire', pavillon: null, statut: 'actif' },
    { id: 2, prenom: 'Ousmane', nom: 'Sow', email: 'technicien@albertroyer.sn', telephone: '77 234 56 78', role: 'technicien', pavillon: null, statut: 'actif' },
    { id: 3, prenom: 'Fatou', nom: 'Diallo', email: 'biologiste@albertroyer.sn', telephone: '77 345 67 89', role: 'biologiste', pavillon: null, statut: 'actif' },
    { id: 4, prenom: 'Aliou', nom: 'Ndiaye', email: 'medecin@albertroyer.sn', telephone: '77 456 78 90', role: 'medecin', pavillon: 'Pavillon M', statut: 'actif' },
  ];

  getPersonnel(): MembrePersonnel[] {
    return this.personnel;
  }

  // Récupérer un membre par son id
  getMembre(id: number): MembrePersonnel | undefined {
    return this.personnel.find(m => m.id === id);
  }

  ajouterMembre(membre: MembrePersonnel): void {
    this.personnel.push(membre);
  }

  // Modifier un membre existant
  modifierMembre(membreModifie: MembrePersonnel): void {
    const index = this.personnel.findIndex(m => m.id === membreModifie.id);
    if (index !== -1) {
      this.personnel[index] = membreModifie;
    }
  }

  // Activer / Désactiver un compte
  basculerStatut(id: number): void {
    const membre = this.personnel.find(m => m.id === id);
    if (membre) {
      membre.statut = membre.statut === 'actif' ? 'inactif' : 'actif';
    }
  }

  getPersonnelAffectable(): MembrePersonnel[] {
    return this.personnel.filter(m => m.role === 'major' || m.role === 'medecin');
  }

  // Récupérer les médecins (pour le choix du prescripteur)
  getMedecins(): MembrePersonnel[] {
    return this.personnel.filter(m => m.role === 'medecin');
  }

  changerAffectation(id: number, pavillon: string): void {
    const membre = this.personnel.find(m => m.id === id);
    if (membre) {
      membre.pavillon = pavillon;
    }
  }
}