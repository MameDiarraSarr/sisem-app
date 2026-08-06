import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface AffectationVue {
  id: number;
  medecin: string;
  specialite: string | null;
  pavillon: string;
  date_debut: string;
}
interface Medecin { id: number; nom_complet: string; specialite: string | null; }
interface Pavillon { id: number; nom: string; }

@Component({
  selector: 'app-admin-affectations',
  imports: [FormsModule],
  templateUrl: './affectations.html',
  styleUrl: './affectations.scss',
})
export class Affectations implements OnInit {
  private http = inject(HttpClient);
  private readonly url = environment.apiUrl;

  affectations = signal<AffectationVue[]>([]);
  medecins = signal<Medecin[]>([]);
  pavillons = signal<Pavillon[]>([]);

  medecinId = '';
  pavillonId = '';
  chargement = signal(false);
  erreur = signal<string | null>(null);

  ngOnInit(): void {
    this.charger();
    this.http.get<Medecin[]>(`${this.url}/medecins`).subscribe({
      next: (l) => this.medecins.set(l),
    });
    this.http.get<Pavillon[]>(`${this.url}/pavillons`).subscribe({
      next: (l) => this.pavillons.set(l),
    });
  }

  private charger(): void {
    this.http.get<AffectationVue[]>(`${this.url}/affectations`).subscribe({
      next: (l) => this.affectations.set(l),
    });
  }

  affecter(): void {
    if (!this.medecinId || !this.pavillonId) {
      this.erreur.set('Choisissez un médecin et un pavillon.');
      return;
    }
    this.erreur.set(null);
    this.chargement.set(true);

    this.http.post(`${this.url}/affectations`, {
      medecin_id: Number(this.medecinId),
      pavillon_id: Number(this.pavillonId),
    }).subscribe({
      next: () => {
        this.chargement.set(false);
        this.medecinId = '';
        this.pavillonId = '';
        this.charger(); // rafraîchit la liste
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors de l\'affectation.');
      },
    });
  }
}