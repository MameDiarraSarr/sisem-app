import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProfilPersonnel {
  type: string;
  id: number;
  prenom: string;
  nom: string;
  email: string;
  telephone: string | null;
  adresse: string | null;
  role: string;
  matricule: string | null;
}

export interface ModifierProfilDto {
  email: string;
  telephone: string | null;
  adresse: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProfilService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/personnel/profil`;

  getProfil(): Observable<ProfilPersonnel> {
    return this.http.get<ProfilPersonnel>(this.url);
  }

  modifierProfil(data: ModifierProfilDto): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(this.url, data);
  }
}