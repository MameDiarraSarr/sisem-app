import { Injectable } from '@angular/core';
import { ResultatPatient } from '../models/resultat';

@Injectable({
  providedIn: 'root'
})
export class ResultatService {

  // ⚠️ Résultats fictifs — seront remplacés par le backend Laravel
  private resultats: ResultatPatient[] = [
    {
      id: 1, patientId: 1, numeroLabo: '20/16/06/2026', examenNom: 'Hémogramme',
      medecinPrescripteur: 'Dr. Aliou Ndiaye', dateResultat: '18/06/2026', statut: 'valide',
      analyses: [
        { nom: 'Hémoglobine', valeur: '13.5', unite: 'g/dL', valeurReference: '12 - 16' },
        { nom: 'Globules blancs', valeur: '7200', unite: '/mm³', valeurReference: '4000 - 10000' },
        { nom: 'Plaquettes', valeur: '250000', unite: '/mm³', valeurReference: '150000 - 400000' },
        { nom: 'Hématocrite', valeur: '41', unite: '%', valeurReference: '37 - 47' },
      ],
      commentaire: 'Résultats dans les normes.'
    },
    {
      id: 4, patientId: 1, numeroLabo: '21/16/06/2026', examenNom: 'Ionogramme',
      medecinPrescripteur: 'Dr. Aliou Ndiaye', dateResultat: '18/06/2026', statut: 'valide',
      analyses: [
        { nom: 'Sodium (Na+)', valeur: '139', unite: 'mmol/L', valeurReference: '135 - 145' },
        { nom: 'Potassium (K+)', valeur: '5.4', unite: 'mmol/L', valeurReference: '3.5 - 5.0' },
        { nom: 'Chlore (Cl-)', valeur: '101', unite: 'mmol/L', valeurReference: '98 - 107' },
      ],
      commentaire: 'Légère hyperkaliémie. Contrôle recommandé.'
    },
    {
      id: 2, patientId: 1, numeroLabo: '18/10/06/2026', examenNom: 'Glycémie',
      medecinPrescripteur: 'Dr. Aliou Ndiaye', dateResultat: '12/06/2026', statut: 'valide',
      analyses: [
        { nom: 'Glucose à jeun', valeur: '0.95', unite: 'g/L', valeurReference: '0.70 - 1.10' },
      ],
      commentaire: 'Glycémie normale.'
    },
    {
      id: 5, patientId: 1, numeroLabo: '09/02/03/2026', examenNom: 'Bilan rénal',
      medecinPrescripteur: null, dateResultat: '04/03/2026', statut: 'valide',
      analyses: [
        { nom: 'Créatinine', valeur: '9', unite: 'mg/L', valeurReference: '6 - 12' },
        { nom: 'Urée', valeur: '0.30', unite: 'g/L', valeurReference: '0.15 - 0.45' },
      ],
      commentaire: 'Fonction rénale normale.'
    },
    {
      id: 3, patientId: 2, numeroLabo: '25/20/06/2026', examenNom: 'Bilan rénal',
      medecinPrescripteur: 'Dr. Aliou Ndiaye', dateResultat: '22/06/2026', statut: 'valide',
      analyses: [
        { nom: 'Créatinine', valeur: '9', unite: 'mg/L', valeurReference: '6 - 12' },
        { nom: 'Urée', valeur: '0.30', unite: 'g/L', valeurReference: '0.15 - 0.45' },
      ],
      commentaire: 'Fonction rénale normale.'
    },
  ];

  getResultatsParPatient(patientId: number): ResultatPatient[] {
    return this.resultats.filter(r => r.patientId === patientId);
  }

  getResultat(id: number): ResultatPatient | undefined {
    return this.resultats.find(r => r.id === id);
  }
}