import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Examen } from '../models/examen';

@Injectable({ providedIn: 'root' })
export class ExamenService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/examens`;

  getExamens(): Observable<Examen[]> {
    return this.http.get<Examen[]>(this.url);
  }

  getExamen(id: number): Observable<Examen> {
    return this.http.get<Examen>(`${this.url}/${id}`);
  }
}