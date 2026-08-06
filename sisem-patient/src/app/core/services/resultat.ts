import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResultatPatient } from '../models/resultat';

@Injectable({ providedIn: 'root' })
export class ResultatService {

  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/patient`;

  // Tous les résultats validés du patient connecté
  getMesResultats(): Observable<ResultatPatient[]> {
    return this.http.get<ResultatPatient[]>(`${this.url}/resultats`);
  }

  // Un résultat précis (par id d'examen), retrouvé dans la liste du patient
  getResultat(id: number): Observable<ResultatPatient | undefined> {
    return this.getMesResultats().pipe(
      map((resultats) => resultats.find((r) => r.id === id))
    );
  }
}