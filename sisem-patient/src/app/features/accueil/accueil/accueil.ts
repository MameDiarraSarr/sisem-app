import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { ResultatService } from '../../../core/services/resultat';

@Component({
  selector: 'app-accueil',
  imports: [RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class Accueil {

  private auth = inject(Auth);
  private resultatService = inject(ResultatService);
  private router = inject(Router);

  // Le patient connecté
  patient = this.auth.patientConnecte();

  // Ses résultats
  resultats = this.patient ? this.resultatService.getResultatsParPatient(this.patient.id) : [];

  seDeconnecter(): void {
    this.auth.deconnexion();
    this.router.navigate(['/login']);
  }
}