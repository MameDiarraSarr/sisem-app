import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
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
  confirmation = '';
  chargement = signal(false);
  message = signal('');
  erreur = signal('');
  termine = signal(false);

  private token = '';
  private telephone = '';

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    this.telephone = this.route.snapshot.queryParamMap.get('telephone') ?? '';

    if (!this.token || !this.telephone) {
      this.erreur.set('Lien invalide ou incomplet.');
    }
  }

  reinitialiser(): void {
    if (!this.motDePasse || !this.confirmation) {
      this.erreur.set('Veuillez remplir les deux champs.');
      return;
    }
    if (this.motDePasse !== this.confirmation) {
      this.erreur.set('Les mots de passe ne correspondent pas.');
      return;
    }
    if (this.motDePasse.length < 8) {
      this.erreur.set('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    this.erreur.set('');
    this.chargement.set(true);

    this.http
      .post<{ message: string }>(`${environment.apiUrl}/patient/reinitialiser-mot-de-passe`, {
        telephone: this.telephone,
        token: this.token,
        mot_de_passe: this.motDePasse,
        mot_de_passe_confirmation: this.confirmation,
      })
      .subscribe({
        next: (rep) => {
          this.chargement.set(false);
          this.message.set(rep.message);
          this.termine.set(true);
        },
        error: (err) => {
          this.chargement.set(false);
          this.erreur.set(err.error?.message ?? 'Une erreur est survenue.');
        },
      });
  }
}