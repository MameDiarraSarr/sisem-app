import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface NotificationPatient {
  id: number;
  message: string;
  lien: string | null;
  lu: boolean;
  date?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/patient`;

  mesNotifications(): Observable<NotificationPatient[]> {
    return this.http.get<NotificationPatient[]>(`${this.url}/notifications`);
  }

  marquerLue(id: number): Observable<any> {
    return this.http.patch(`${this.url}/notifications/${id}/lue`, {});
  }
}