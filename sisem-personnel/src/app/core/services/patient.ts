import { Injectable } from '@angular/core';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  // ⚠️ Données fictives temporaires — seront remplacées par le backend Laravel
  private patients: Patient[] = [
    { id: 1, prenom: 'Amadou', nom: 'Diop', dateNaissance: '2018-03-12', age: 8, sexe: 'M', telephone: '771234567', email: null, adresse: 'Sicap Liberté 6', ville: 'Dakar', numeroDossier: 'DOS-0001', typePatient: 'interne', pavillon: 'Pavillon M', dateEnregistrement: '16/06/2026' },
    { id: 2, prenom: 'Fatou', nom: 'Ndiaye', dateNaissance: '2021-07-04', age: 5, sexe: 'F', telephone: '772345678', email: null, adresse: 'Grand Yoff', ville: 'Dakar', numeroDossier: 'DOS-0002', typePatient: 'externe', pavillon: null, dateEnregistrement: '16/06/2026' },
    { id: 3, prenom: 'Moussa', nom: 'Sarr', dateNaissance: '2015-01-20', age: 11, sexe: 'M', telephone: '773456789', email: null, adresse: 'Pikine', ville: 'Dakar', numeroDossier: 'DOS-0003', typePatient: 'interne', pavillon: 'USAD', dateEnregistrement: '16/06/2026' },
    { id: 4, prenom: 'Aïssatou', nom: 'Ba', dateNaissance: '2023-05-09', age: 3, sexe: 'F', telephone: '774567890', email: null, adresse: 'Guédiawaye', ville: 'Dakar', numeroDossier: 'DOS-0004', typePatient: 'externe', pavillon: null, dateEnregistrement: '16/06/2026' },
    { id: 5, prenom: 'Ibrahima', nom: 'Sy', dateNaissance: '2019-11-02', age: 7, sexe: 'M', telephone: '775678901', email: null, adresse: 'Parcelles Assainies', ville: 'Dakar', numeroDossier: 'DOS-0005', typePatient: 'interne', pavillon: 'Pavillon M', dateEnregistrement: '16/06/2026' },
  ];

  getPatients(): Patient[] {
    return this.patients;
  }

  ajouterPatient(patient: Patient): void {
    this.patients.push(patient);
  }
}