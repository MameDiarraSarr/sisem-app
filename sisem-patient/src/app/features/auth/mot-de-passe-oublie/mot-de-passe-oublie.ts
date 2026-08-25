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
  telephone = '';
  chargement = signal(false);
  message = signal('');
  erreur = signal('');

  private http = inject(HttpClient);

  envoyer(): void {
    if (!this.telephone) {
      this.erreur.set('Veuillez saisir votre numéro de téléphone.');
      return;
    }

    this.erreur.set('');
    this.message.set('');
    this.chargement.set(true);

    this.http
      .post<{ message: string }>(`${environment.apiUrl}/patient/mot-de-passe-oublie`, {
        telephone: this.telephone,
      })
      .subscribe({
        next: (rep) => {
          this.chargement.set(false);
          this.message.set(rep.message);
        },
        error: () => {
          this.chargement.set(false);
          this.erreur.set('Une erreur est survenue. Réessayez plus tard.');
        },
      });
  }
}