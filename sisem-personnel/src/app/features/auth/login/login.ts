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

  email = '';
  motDePasse = '';

  // État pour l'affichage (chargement / erreur)
  chargement = signal(false);
  erreur = signal<string | null>(null);

  private auth = inject(Auth);
  private router = inject(Router);

  seConnecter(): void {
    this.erreur.set(null);
    this.chargement.set(true);

    this.auth.connexion(this.email, this.motDePasse).subscribe({
      next: () => {
        this.chargement.set(false);
        this.redirigerSelonRole();
      },
      error: (err) => {
        this.chargement.set(false);
        // 422 = identifiants invalides ; sinon message générique
        if (err.status === 422 || err.status === 401) {
          this.erreur.set('Email ou mot de passe incorrect.');
        } else {
          this.erreur.set('Impossible de contacter le serveur. Réessayez.');
        }
      },
    });
  }

  private redirigerSelonRole(): void {
    const role = this.auth.utilisateurConnecte()?.role;
    const routes: Record<string, string> = {
      secretaire: '/secretaire',
      technicien: '/technicien',
      biologiste: '/biologiste',
      medecin: '/medecin',
      admin: '/admin',
      major: '/major',
    };
    this.router.navigate([routes[role ?? ''] ?? '/login']);
  }
}