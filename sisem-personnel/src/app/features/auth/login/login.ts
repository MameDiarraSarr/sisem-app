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

  // Les champs liés au formulaire
  email = '';
  motDePasse = '';

  // On récupère le service d'authentification et le router
  private auth = inject(Auth);
  private router = inject(Router);

  // Fonction appelée au clic sur "Se connecter"
  seConnecter(): void {
    const reussi = this.auth.connexion(this.email, this.motDePasse);

    if (reussi) {
      const role = this.auth.utilisateurConnecte()?.role;
      if (role === 'secretaire') {
        this.router.navigate(['/secretaire']);
      } else if (role === 'technicien') {
        this.router.navigate(['/technicien']);
      } else if (role === 'biologiste') {
        this.router.navigate(['/biologiste']);
      } else if (role === 'medecin') {
        this.router.navigate(['/medecin']);
      } else if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else if (role === 'major') {
        this.router.navigate(['/major']);
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      alert('Email ou mot de passe incorrect.');
    }
  }
}