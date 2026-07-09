import { Injectable } from '@angular/core';
import { Examen } from '../models/examen';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  // ⚠️ Catalogue des examens du laboratoire — sera remplacé par le backend Laravel
  private examens: Examen[] = [
    {
      id: 1,
      nom: 'Hémogramme',
      analyses: [
        { nom: 'Hémoglobine', unite: 'g/dL', valeurReference: '12 - 16' },
        { nom: 'Globules blancs', unite: '/mm³', valeurReference: '4000 - 10000' },
        { nom: 'Plaquettes', unite: '/mm³', valeurReference: '150000 - 400000' },
        { nom: 'Hématocrite', unite: '%', valeurReference: '37 - 47' },
      ]
    },
    {
      id: 2,
      nom: 'Glycémie',
      analyses: [
        { nom: 'Glucose à jeun', unite: 'g/L', valeurReference: '0.70 - 1.10' },
      ]
    },
    {
      id: 3,
      nom: 'Bilan rénal',
      analyses: [
        { nom: 'Créatinine', unite: 'mg/L', valeurReference: '6 - 12' },
        { nom: 'Urée', unite: 'g/L', valeurReference: '0.15 - 0.45' },
      ]
    },
    {
      id: 4,
      nom: 'Ionogramme',
      analyses: [
        { nom: 'Sodium (Na+)', unite: 'mmol/L', valeurReference: '135 - 145' },
        { nom: 'Potassium (K+)', unite: 'mmol/L', valeurReference: '3.5 - 5.0' },
        { nom: 'Chlore (Cl-)', unite: 'mmol/L', valeurReference: '98 - 107' },
      ]
    },
    {
      id: 5,
      nom: 'Sérologie',
      analyses: [
        { nom: 'Résultat sérologique', unite: '', valeurReference: 'Négatif' },
      ]
    },
  ];

  // Tous les examens du catalogue
  getExamens(): Examen[] {
    return this.examens;
  }

  // Récupérer un examen par son id
  getExamen(id: number): Examen | undefined {
    return this.examens.find(e => e.id === id);
  }
}