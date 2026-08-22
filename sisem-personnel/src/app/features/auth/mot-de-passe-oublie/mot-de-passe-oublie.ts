import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mot-de-passe-oublie',
  imports: [FormsModule, RouterLink],
  templateUrl: './mot-de-passe-oublie.html',
  styleUrl: './mot-de-passe-oublie.scss',
})
export class MotDePasseOublie {

  email = '';

  chargement = signal(false);
  message = signal<string | null>(null);
  erreur = signal<string | null>(null);

  private http = inject(HttpClient);

  envoyer(): void {
    if (!this.email.trim()) {
      this.erreur.set('Veuillez saisir votre adresse e-mail.');
      return;
    }

    this.erreur.set(null);
    this.message.set(null);
    this.chargement.set(true);

    this.http.post<{ message: string }>(
      `${environment.apiUrl}/personnel/mot-de-passe-oublie`,
      { email: this.email }
    ).subscribe({
      next: (res) => {
        this.chargement.set(false);
        this.message.set(res.message);
      },
      error: () => {
        this.chargement.set(false);
        this.erreur.set('Impossible de contacter le serveur. Réessayez.');
      },
    });
  }
}