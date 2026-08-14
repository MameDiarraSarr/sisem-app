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
  panneauNotifsOuvert = signal(false);

  // Notifications : lues depuis le service partagé (état commun avec la liste)
  notifications = this.notifService.notifications;
  nombreNonLues = this.notifService.nombreNonLues;

  ngOnInit(): void {
    this.notifService.charger();
  }

  basculerPanneauNotifs(): void {
    this.panneauNotifsOuvert.update(v => !v);
  }

  ouvrirNotification(notif: NotificationPatient): void {
    this.panneauNotifsOuvert.set(false);
    // On amène vers la liste ; c'est en dépliant le résultat que la notif sera marquée lue
    this.router.navigate(['/accueil']);
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