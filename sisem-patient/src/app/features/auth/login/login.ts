import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  telephone = '';
  motDePasse = '';
  erreur = signal('');
  chargement = signal(false);

  private auth = inject(Auth);
  private router = inject(Router);

  seConnecter(): void {
    if (!this.telephone || !this.motDePasse) {
      this.erreur.set('Veuillez remplir tous les champs.');
      return;
    }

    this.erreur.set('');
    this.chargement.set(true);

    this.auth.connexion(this.telephone, this.motDePasse).subscribe({
      next: () => {
        this.chargement.set(false);
        this.router.navigate(['/accueil']);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(
          err.error?.message ?? 'Numéro ou mot de passe incorrect.'
        );
      },
    });
  }
}