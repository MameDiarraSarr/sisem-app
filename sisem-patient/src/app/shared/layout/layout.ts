import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { Assistant } from '../assistant/assistant';
import { NotificationService, NotificationPatient } from '../../core/services/notification';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Assistant],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {

  private auth = inject(Auth);
  private router = inject(Router);
  private notifService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  patient = this.auth.patientConnecte();

  menuOuvert = signal(false);

  // Notifications
  notifications = signal<NotificationPatient[]>([]);
  panneauNotifsOuvert = signal(false);

  ngOnInit(): void {
    this.chargerNotifications();
  }

  private chargerNotifications(): void {
    this.notifService.mesNotifications().subscribe({
      next: (liste) => {
        this.notifications.set(liste);
        this.cdr.markForCheck();
      },
    });
  }

  // Nombre de notifications non lues (pour le badge)
  nombreNonLues(): number {
    return this.notifications().filter(n => !n.lu).length;
  }

  basculerPanneauNotifs(): void {
    this.panneauNotifsOuvert.update(v => !v);
  }

  ouvrirNotification(notif: NotificationPatient): void {
    // Marquer comme lue
    if (!notif.lu) {
      this.notifService.marquerLue(notif.id).subscribe({
        next: () => {
          notif.lu = true;
          this.notifications.set([...this.notifications()]);
          this.cdr.markForCheck();
        },
      });
    }
    this.panneauNotifsOuvert.set(false);
    // Aller vers le résultat concerné si un lien existe
    if (notif.lien) {
      this.router.navigateByUrl(notif.lien);
    }
  }

  basculerMenu(): void {
    this.menuOuvert.update(v => !v);
  }

  fermerMenu(): void {
    this.menuOuvert.set(false);
  }

  seDeconnecter(): void {
    this.fermerMenu();
    this.auth.deconnexion();
    this.router.navigate(['/login']);
  }
}