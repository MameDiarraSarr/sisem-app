import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Utilisateur {
  id: number;
  email: string;
  role: 'secretaire' | 'technicien' | 'biologiste' | 'major' | 'medecin' | 'admin';
  prenom: string;
  nom: string;
  pavillon?: string | null;
  mot_de_passe_temporaire: boolean;
}

interface ReponseConnexion {
  token: string;
  utilisateur: Utilisateur;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private readonly url = environment.apiUrl;

  utilisateurConnecte = signal<Utilisateur | null>(null);

  constructor() {
    // Restaure la session au rechargement de la page
    const stocke = localStorage.getItem('utilisateur');
    if (stocke) {
      this.utilisateurConnecte.set(JSON.parse(stocke));
    }
  }

  connexion(email: string, motDePasse: string): Observable<ReponseConnexion> {
    return this.http
      .post<ReponseConnexion>(`${this.url}/personnel/connexion`, {
        email,
        password: motDePasse,
      })
      .pipe(
        tap((reponse) => {
          localStorage.setItem('token', reponse.token);
          localStorage.setItem('utilisateur', JSON.stringify(reponse.utilisateur));
          this.utilisateurConnecte.set(reponse.utilisateur);
        })
      );
  }

  deconnexion(): void {
    this.http
      .post(`${this.url}/personnel/deconnexion`, {})
      .subscribe({ complete: () => this.nettoyer(), error: () => this.nettoyer() });
  }

  private nettoyer(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    this.utilisateurConnecte.set(null);
  }

  estConnecte(): boolean {
    return this.utilisateurConnecte() !== null;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }
}