import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { Assistant } from '../assistant/assistant';

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Assistant],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

  private auth = inject(Auth);
  private router = inject(Router);

  patient = this.auth.patientConnecte();

  // Menu hamburger ouvert/fermé (mobile)
  menuOuvert = signal(false);

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