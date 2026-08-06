import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MembrePersonnel } from '../models/membre-personnel';

export interface Medecin {
  id: number;
  nom_complet: string;
  prenom: string;
  nom: string;
  specialite: string | null;
}

@Injectable({ providedIn: 'root' })
export class PersonnelService {
  private http = inject(HttpClient);
  private readonly url = environment.apiUrl;

  getPersonnel(recherche?: string): Observable<MembrePersonnel[]> {
    const params = recherche ? `?recherche=${encodeURIComponent(recherche)}` : '';
    return this.http.get<MembrePersonnel[]>(`${this.url}/personnel${params}`);
  }

  ajouterMembre(membre: any): Observable<MembrePersonnel> {
    return this.http.post<MembrePersonnel>(`${this.url}/personnel`, membre);
  }

  modifierMembre(id: number, membre: any): Observable<MembrePersonnel> {
    return this.http.put<MembrePersonnel>(`${this.url}/personnel/${id}`, membre);
  }

  basculerStatut(id: number): Observable<any> {
    return this.http.patch(`${this.url}/personnel/${id}/statut`, {});
  }

  // Liste des médecins (pour le choix du prescripteur)
  getMedecins(): Observable<Medecin[]> {
    return this.http.get<Medecin[]>(`${this.url}/medecins`);
  }
}