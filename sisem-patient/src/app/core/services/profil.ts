import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProfilPatient {
  type: string;
  id: number;
  prenom: string;
  nom: string;
  telephone: string;
  email: string | null;
  adresse: string | null;
  ville: string | null;
  numero_dossier: string | null;
  sexe: string | null;
  age: string | null;
}

export interface ModifierProfilDto {
  telephone: string;
  email: string | null;
  adresse: string | null;
  ville: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProfilService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/patient`;

  afficher(): Observable<ProfilPatient> {
    return this.http.get<ProfilPatient>(`${this.url}/profil`);
  }

  modifier(dto: ModifierProfilDto): Observable<any> {
    return this.http.put(`${this.url}/profil`, dto);
  }
}