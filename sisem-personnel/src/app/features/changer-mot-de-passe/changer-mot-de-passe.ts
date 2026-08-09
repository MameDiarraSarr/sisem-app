import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../core/services/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-changer-mot-de-passe',
  imports: [FormsModule],
  templateUrl: './changer-mot-de-passe.html',
  styleUrl: './changer-mot-de-passe.scss',
})
export class ChangerMotDePasse {

  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(Auth);

  ancien = '';
  nouveau = '';
  confirmation = '';
  erreur = signal('');
  chargement = signal(false);

  changer(): void {
    if (!this.ancien || !this.nouveau || !this.confirmation) {
      this.erreur.set('Veuillez remplir tous les champs.');
      return;
    }
    if (this.nouveau.length < 6) {
      this.erreur.set('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (this.nouveau !== this.confirmation) {
      this.erreur.set('Les deux mots de passe ne correspondent pas.');
      return;
    }

    this.erreur.set('');
    this.chargement.set(true);

    this.http.post(`${environment.apiUrl}/personnel/changer-mot-de-passe`, {
      ancien_mot_de_passe: this.ancien,
      nouveau_mot_de_passe: this.nouveau,
      nouveau_mot_de_passe_confirmation: this.confirmation,
    }).subscribe({
      next: () => {
        this.chargement.set(false);
        // Marquer le mot de passe comme non temporaire dans la session locale
        const u = this.auth.utilisateurConnecte();
        if (u) {
          const maj = { ...u, mot_de_passe_temporaire: false };
          this.auth.utilisateurConnecte.set(maj);
          localStorage.setItem('utilisateur', JSON.stringify(maj));
        }
        this.redirigerSelonRole();
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(
          err.error?.errors?.ancien_mot_de_passe?.[0]
          ?? err.error?.message
          ?? 'Erreur lors du changement.'
        );
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