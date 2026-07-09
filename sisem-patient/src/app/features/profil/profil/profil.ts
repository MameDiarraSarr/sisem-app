import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-profil',
  imports: [],
  templateUrl: './profil.html',
  styleUrl: './profil.scss',
})
export class Profil {

  private auth = inject(Auth);
  private router = inject(Router);

  patient = this.auth.patientConnecte();

  initiales(): string {
    const p = this.patient;
    if (!p) return '';
    return (p.prenom[0] + p.nom[0]).toUpperCase();
  }

  seDeconnecter(): void {
    this.auth.deconnexion();
    this.router.navigate(['/login']);
  }
}