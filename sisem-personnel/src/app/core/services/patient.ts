import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Patient } from '../models/patient';

// Ce qu'on envoie pour créer un patient (le backend calcule âge, n° dossier, etc.)
export interface NouveauPatientDto {
  prenom: string;
  nom: string;
  date_naissance: string | null;
  age_valeur?: number;
  age_unite?: 'ans' | 'mois';
  sexe: string | null;
  telephone: string;
  email: string | null;
  adresse: string | null;
  ville: string | null;
  type_patient: 'interne' | 'externe';
  pavillon_id: number | null;
}

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/patients`;

  getPatients(recherche?: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.url);
  }

  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.url}/${id}`);
  }

  ajouterPatient(patient: NouveauPatientDto): Observable<Patient> {
    return this.http.post<Patient>(this.url, patient);
  }

  modifierPatient(id: number, patient: Partial<NouveauPatientDto>): Observable<Patient> {
    return this.http.put<Patient>(`${this.url}/${id}`, patient);
  }
}