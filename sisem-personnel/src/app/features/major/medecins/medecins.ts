import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/services/auth';
import { environment } from '../../../../environments/environment';

interface MedecinPavillon {
  id: number;
  nom_complet: string;
  prenom: string;
  nom: string;
  specialite: string | null;
  statut_affectation: string;
}

@Component({
  selector: 'app-major-medecins',
  imports: [],
  templateUrl: './medecins.html',
  styleUrl: './medecins.scss',
})
export class Medecins implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);
  private readonly url = environment.apiUrl;

  pavillon = this.auth.utilisateurConnecte()?.pavillon ?? '';

  medecins = signal<MedecinPavillon[]>([]);
  charge = signal(false);

  ngOnInit(): void {
    this.charger();
  }

  private charger(): void {
    this.http.get<MedecinPavillon[]>(`${this.url}/major/medecins`).subscribe({
      next: (liste) => {
        this.medecins.set(liste);
        this.charge.set(true);
      },
      error: () => this.charge.set(true),
    });
  }

  basculerStatut(medecinId: number): void {
    this.http.patch(`${this.url}/major/medecins/${medecinId}/statut`, {}).subscribe({
      next: () => this.charger(), // recharge pour refléter le nouveau statut
    });
  }
}