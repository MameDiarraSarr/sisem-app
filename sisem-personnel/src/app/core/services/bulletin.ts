import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bulletin } from '../models/bulletin';

// Ce qu'on envoie pour créer un bulletin
export interface NouveauBulletinDto {
  numero_labo: string;
  patient_id: number;
  medecin_id: number | null;
  indication_examen: string;
  traitement_en_cours: string | null;
  examens: number[];
}

@Injectable({ providedIn: 'root' })
export class BulletinService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/bulletins`;

  getBulletins(): Observable<Bulletin[]> {
    return this.http.get<Bulletin[]>(this.url);
  }

  getBulletin(id: number): Observable<Bulletin> {
    return this.http.get<Bulletin>(`${this.url}/${id}`);
  }

  getBulletinsDuPatient(patientId: number): Observable<Bulletin[]> {
    return this.http.get<Bulletin[]>(`${this.url}?patient_id=${patientId}`);
  }

  ajouterBulletin(bulletin: NouveauBulletinDto): Observable<Bulletin> {
    return this.http.post<Bulletin>(this.url, bulletin);
  }

  validerBulletin(id: number): Observable<any> {
    return this.http.patch(`${this.url}/${id}/valider`, {});
  }

  renvoyerBulletin(id: number): Observable<any> {
    return this.http.patch(`${this.url}/${id}/renvoyer`, {});
  }

  marquerImprime(id: number): Observable<{ imprime_le: string; nombre_impressions: number }> {
    return this.http.patch<{ imprime_le: string; nombre_impressions: number }>(`${this.url}/${id}/imprimer`, {});
  }
}