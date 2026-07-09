import { Component, inject } from '@angular/core';
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
  erreur = '';

  private auth = inject(Auth);
  private router = inject(Router);

  seConnecter(): void {
    if (!this.telephone || !this.motDePasse) {
      this.erreur = 'Veuillez remplir tous les champs.';
      return;
    }

    const reussi = this.auth.connexion(this.telephone, this.motDePasse);

    if (reussi) {
      this.router.navigate(['/accueil']);
    } else {
      this.erreur = 'Numéro ou mot de passe incorrect.';
    }
  }
}