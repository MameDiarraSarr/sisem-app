import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Confirmation } from '../../../shared/confirmation/confirmation';

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
  imports: [FormsModule, Confirmation],
  templateUrl: './affectations.html',
  styleUrl: './affectations.scss',
})
export class Affectations implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private readonly url = environment.apiUrl;

  affectations = signal<AffectationVue[]>([]);
  medecins = signal<Medecin[]>([]);
  pavillons = signal<Pavillon[]>([]);

  medecinId = '';
  pavillonId = '';
  chargement = signal(false);
  erreur = signal<string | null>(null);

  affectationARetirer = signal<number | null>(null);

  ngOnInit(): void {
    this.charger();

    this.http.get<Medecin[]>(`${this.url}/medecins`).subscribe({
      next: (l) => {
        this.medecins.set(l);
        // Si on arrive depuis la création d'un médecin, on le pré-sélectionne
        const medecinParam = this.route.snapshot.queryParamMap.get('medecin');
        if (medecinParam) {
          this.medecinId = medecinParam;
        }
        this.cdr.markForCheck();
      },
    });

    this.http.get<Pavillon[]>(`${this.url}/pavillons`).subscribe({
      next: (l) => {
        this.pavillons.set(l);
        this.cdr.markForCheck();
      },
    });
  }

  private charger(): void {
    this.http.get<AffectationVue[]>(`${this.url}/affectations`).subscribe({
      next: (l) => {
        this.affectations.set(l);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.erreur.set(err.error?.message ?? 'Erreur lors du chargement des affectations.');
        this.cdr.markForCheck();
      },
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
        this.charger();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors de l\'affectation.');
        this.cdr.markForCheck();
      },
    });
  }

  demanderRetrait(id: number): void {
    this.affectationARetirer.set(id);
  }

  confirmerRetrait(): void {
    const id = this.affectationARetirer();
    if (id === null) return;
    this.affectationARetirer.set(null);

    this.http.patch(`${this.url}/affectations/${id}/retirer`, {}).subscribe({
      next: () => this.charger(),
      error: (err) => {
        this.erreur.set(err.error?.message ?? 'Erreur lors du retrait.');
        this.cdr.markForCheck();
      },
    });
  }

  annulerRetrait(): void {
    this.affectationARetirer.set(null);
  }
}