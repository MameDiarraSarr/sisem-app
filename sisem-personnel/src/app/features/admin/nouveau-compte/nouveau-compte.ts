import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PersonnelService } from '../../../core/services/personnel';
import { environment } from '../../../../environments/environment';

interface Pavillon { id: number; nom: string; }

@Component({
  selector: 'app-nouveau-compte',
  imports: [RouterLink, FormsModule],
  templateUrl: './nouveau-compte.html',
  styleUrl: './nouveau-compte.scss',
})
export class NouveauCompte implements OnInit {

  prenom = '';
  nom = '';
  email = '';
  telephone = '';
  role = '';
  pavillonId = '';
  specialite = '';

  pavillons = signal<Pavillon[]>([]);
  chargement = signal(false);
  erreur = signal<string | null>(null);

  private personnelService = inject(PersonnelService);
  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit(): void {
    this.http.get<Pavillon[]>(`${environment.apiUrl}/pavillons`).subscribe({
      next: (liste) => this.pavillons.set(liste),
    });
  }

  besoinPavillon(): boolean {
    return this.role === 'major' || this.role === 'medecin';
  }

  enregistrer(): void {
    if (!this.prenom || !this.nom || !this.email || !this.role) {
      this.erreur.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    if (this.role === 'major' && !this.pavillonId) {
      this.erreur.set('Un major doit être rattaché à un pavillon.');
      return;
    }

    this.erreur.set(null);
    this.chargement.set(true);

    const donnees = {
      prenom: this.prenom,
      nom: this.nom,
      email: this.email,
      telephone: this.telephone || null,
      role: this.role,
      pavillon_id: this.besoinPavillon() && this.pavillonId ? Number(this.pavillonId) : null,
      specialite: this.role === 'medecin' ? (this.specialite || null) : null,
    };

    this.personnelService.ajouterMembre(donnees).subscribe({
      next: () => {
        this.chargement.set(false);
        this.router.navigate(['/admin/personnel']);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors de la création du compte.');
      },
    });
  }
}