import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);

  // Nombre de bulletins que le rôle connecté doit traiter (pour le badge de la cloche)
  nombreATraiter = signal(0);

  charger(): void {
    this.http.get<{ nombre: number }>(`${environment.apiUrl}/bulletins/nombre-a-traiter`).subscribe({
      next: (res) => this.nombreATraiter.set(res.nombre),
      error: () => this.nombreATraiter.set(0),
    });
  }
}