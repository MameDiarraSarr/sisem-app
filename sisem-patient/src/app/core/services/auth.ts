import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Patient {
  id: number;
  prenom: string;
  nom: string;
  telephone: string;
  numero_dossier: string | null;
}

interface ReponseConnexion {
  token: string;
  patient: Patient & { mot_de_passe_temporaire: boolean };
}

@Injectable({ providedIn: 'root' })
export class Auth {

  private http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/patient`;

  patientConnecte = signal<Patient | null>(null);
  motDePasseTemporaire = signal(false);

  // Connexion par téléphone + mot de passe (appelle le backend)
  connexion(telephone: string, motDePasse: string): Observable<ReponseConnexion> {
    return this.http
      .post<ReponseConnexion>(`${this.url}/connexion`, {
        telephone,
        mot_de_passe: motDePasse,
      })
      .pipe(
        tap((reponse) => {
          localStorage.setItem('token', reponse.token);
          this.patientConnecte.set({
            id: reponse.patient.id,
            prenom: reponse.patient.prenom,
            nom: reponse.patient.nom,
            telephone: reponse.patient.telephone,
            numero_dossier: reponse.patient.numero_dossier,
          });
          this.motDePasseTemporaire.set(reponse.patient.mot_de_passe_temporaire);
        })
      );
  }

  deconnexion(): void {
    this.http.post(`${this.url}/deconnexion`, {}).subscribe({
      next: () => this.viderSession(),
      error: () => this.viderSession(),
    });
  }

  private viderSession(): void {
    localStorage.removeItem('token');
    this.patientConnecte.set(null);
  }

  estConnecte(): boolean {
    return this.patientConnecte() !== null;
  }
}