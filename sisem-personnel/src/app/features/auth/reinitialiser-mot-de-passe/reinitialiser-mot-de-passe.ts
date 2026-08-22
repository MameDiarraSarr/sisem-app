import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reinitialiser-mot-de-passe',
  imports: [FormsModule, RouterLink],
  templateUrl: './reinitialiser-mot-de-passe.html',
  styleUrl: './reinitialiser-mot-de-passe.scss',
})
export class ReinitialiserMotDePasse implements OnInit {

  motDePasse = '';
  motDePasseConfirmation = '';

  token = '';
  email = '';

  chargement = signal(false);
  message = signal<string | null>(null);
  erreur = signal<string | null>(null);
  termine = signal(false);

  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    // On récupère le token et l'e-mail depuis l'URL
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.email = this.route.snapshot.queryParamMap.get('email') ?? '';

    if (!this.token || !this.email) {
      this.erreur.set('Lien invalide. Veuillez refaire une demande.');
    }
  }

  reinitialiser(): void {
    this.erreur.set(null);
    this.message.set(null);

    if (this.motDePasse.length < 8) {
      this.erreur.set('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (this.motDePasse !== this.motDePasseConfirmation) {
      this.erreur.set('Les deux mots de passe ne correspondent pas.');
      return;
    }

    this.chargement.set(true);

    this.http.post<{ message: string }>(
      `${environment.apiUrl}/personnel/reinitialiser-mot-de-passe`,
      {
        email: this.email,
        token: this.token,
        mot_de_passe: this.motDePasse,
        mot_de_passe_confirmation: this.motDePasseConfirmation,
      }
    ).subscribe({
      next: (res) => {
        this.chargement.set(false);
        this.message.set(res.message);
        this.termine.set(true);
      },
      error: (err) => {
        this.chargement.set(false);
        if (err.status === 422 && err.error?.message) {
          this.erreur.set(err.error.message);
        } else {
          this.erreur.set('Impossible de contacter le serveur. Réessayez.');
        }
      },
    });
  }

  allerConnexion(): void {
    this.router.navigate(['/login']);
  }
}