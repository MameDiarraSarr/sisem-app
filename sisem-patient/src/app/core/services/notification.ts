import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface NotificationPatient {
  id: number;
  message: string;
  lien: string | null;
  lu: boolean;
  bulletinExamenId: number | null;
  date?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/patient`;

  // État partagé entre le layout (badge) et la liste (qui marque lu en dépliant)
  notifications = signal<NotificationPatient[]>([]);
  nombreNonLues = computed(() => this.notifications().filter(n => !n.lu).length);

  // Charge les notifications depuis le backend et remplit le signal partagé
  charger(): void {
    this.http.get<NotificationPatient[]>(`${this.url}/notifications`).subscribe({
      next: (liste) => this.notifications.set(liste),
    });
  }

  // Marque une notification lue (par son id) + met à jour le signal
  marquerLue(id: number): void {
    this.http.patch(`${this.url}/notifications/${id}/lue`, {}).subscribe({
      next: () => {
        this.notifications.update(liste =>
          liste.map(n => n.id === id ? { ...n, lu: true } : n)
        );
      },
    });
  }

  // Quand on consulte le résultat d'un bulletin : marque lue la notif liée (si non lue)
  marquerLuePourBulletin(bulletinId: number): void {
    const notif = this.notifications().find(
      n => n.bulletinExamenId === bulletinId && !n.lu
    );
    if (notif) {
      this.marquerLue(notif.id);
    }
  }
}