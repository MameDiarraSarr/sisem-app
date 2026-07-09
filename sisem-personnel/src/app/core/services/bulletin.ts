import { Injectable } from '@angular/core';
import { Bulletin } from '../models/bulletin';

@Injectable({
  providedIn: 'root'
})
export class BulletinService {

  // ⚠️ Données fictives temporaires — seront remplacées par le backend Laravel
  private bulletins: Bulletin[] = [
    { id: 1, numeroLabo: '20/16/06/2026', patientNom: 'Amadou Diop', pavillon: 'Pavillon M', examenId: 1, nomExamen: 'Hémogramme', indication: 'Suspicion d\'anémie', traitementEnCours: null, medecinPrescripteurId: 4, dateEnregistrement: '16/06/2026', statut: 'valide' },
    { id: 2, numeroLabo: '21/16/06/2026', patientNom: 'Fatou Ndiaye', pavillon: null, examenId: 2, nomExamen: 'Glycémie', indication: 'Contrôle diabète', traitementEnCours: 'Metformine', medecinPrescripteurId: null, dateEnregistrement: '16/06/2026', statut: 'enregistre' },
    { id: 3, numeroLabo: '22/16/06/2026', patientNom: 'Moussa Sarr', pavillon: 'USAD', examenId: 3, nomExamen: 'Bilan rénal', indication: 'Suivi insuffisance rénale', traitementEnCours: null, medecinPrescripteurId: 4, dateEnregistrement: '16/06/2026', statut: 'saisi' },
    { id: 4, numeroLabo: '23/16/06/2026', patientNom: 'Aïssatou Ba', pavillon: null, examenId: 5, nomExamen: 'Sérologie', indication: 'Dépistage', traitementEnCours: null, medecinPrescripteurId: null, dateEnregistrement: '16/06/2026', statut: 'enregistre' },
    { id: 5, numeroLabo: '24/16/06/2026', patientNom: 'Ibrahima Sy', pavillon: 'Pavillon M', examenId: 4, nomExamen: 'Ionogramme', indication: 'Déséquilibre électrolytique', traitementEnCours: 'Diurétique', medecinPrescripteurId: 4, dateEnregistrement: '16/06/2026', statut: 'valide' },
  ];

  getBulletins(): Bulletin[] {
    return this.bulletins;
  }

  getBulletinsATraiter(): Bulletin[] {
    return this.bulletins.filter(b => b.statut === 'enregistre');
  }

  getBulletinsAValider(): Bulletin[] {
    return this.bulletins.filter(b => b.statut === 'saisi');
  }

  getBulletinsValides(): Bulletin[] {
    return this.bulletins.filter(b => b.statut === 'valide');
  }

  getBulletinsValidesParPavillon(pavillon: string): Bulletin[] {
    return this.bulletins.filter(b => b.statut === 'valide' && b.pavillon === pavillon);
  }

  ajouterBulletin(bulletin: Bulletin): void {
    this.bulletins.push(bulletin);
  }

  validerBulletin(id: number): void {
    const bulletin = this.bulletins.find(b => b.id === id);
    if (bulletin) {
      bulletin.statut = 'valide';
    }
  }
}