import { Injectable } from '@angular/core';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  // ⚠️ Données fictives temporaires — seront remplacées par un appel au backend Laravel
  private patients: Patient[] = [
    { id: 1, prenom: 'Amadou', nom: 'Diop', age: 8, numeroLabo: '20/16/06/2026', typePatient: 'interne', pavillon: 'Pavillon M', dateEnregistrement: '16/06/2026' },
    { id: 2, prenom: 'Fatou', nom: 'Ndiaye', age: 5, numeroLabo: '21/16/06/2026', typePatient: 'externe', pavillon: null, dateEnregistrement: '16/06/2026' },
    { id: 3, prenom: 'Moussa', nom: 'Sarr', age: 11, numeroLabo: '22/16/06/2026', typePatient: 'interne', pavillon: 'USAD', dateEnregistrement: '16/06/2026' },
    { id: 4, prenom: 'Aïssatou', nom: 'Ba', age: 3, numeroLabo: '23/16/06/2026', typePatient: 'externe', pavillon: null, dateEnregistrement: '16/06/2026' },
    { id: 5, prenom: 'Ibrahima', nom: 'Sy', age: 7, numeroLabo: '24/16/06/2026', typePatient: 'interne', pavillon: 'Pavillon N', dateEnregistrement: '16/06/2026' },
  ];

  // Récupérer la liste de tous les patients
  getPatients(): Patient[] {
    return this.patients;
  }

  // Ajouter un nouveau patient à la liste
  ajouterPatient(patient: Patient): void {
    this.patients.push(patient);
  }
}