import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PersonnelService } from '../../../core/services/personnel';
import { environment } from '../../../../environments/environment';

interface Pavillon { id: number; nom: string; }

@Component({
  selector: 'app-modifier-compte',
  imports: [RouterLink, FormsModule],
  templateUrl: './modifier-compte.html',
  styleUrl: './modifier-compte.scss',
})
export class ModifierCompte implements OnInit {

  private personnelService = inject(PersonnelService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  private id = Number(this.route.snapshot.paramMap.get('id'));

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

  ngOnInit(): void {
    // Charge les pavillons pour le menu déroulant
    this.http.get<Pavillon[]>(`${environment.apiUrl}/pavillons`).subscribe({
      next: (liste) => {
        this.pavillons.set(liste);
        this.cdr.markForCheck();
      },
    });

    // Charge le personnel puis retrouve le membre à modifier
    this.personnelService.getPersonnel().subscribe({
      next: (liste) => {
        const membre = liste.find(m => m.id === this.id);
        if (membre) {
          this.prenom = membre.prenom;
          this.nom = membre.nom;
          this.email = membre.email;
          this.telephone = membre.telephone ?? '';
          this.role = membre.role;
          this.pavillonId = membre.pavillon_id ? String(membre.pavillon_id) : '';
        }
        this.cdr.markForCheck();
      },
    });
  }

  besoinPavillon(): boolean {
    return this.role === 'major' || this.role === 'medecin';
  }

  enregistrer(): void {
    if (!this.prenom || !this.nom || !this.email) {
      this.erreur.set('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    this.erreur.set(null);
    this.chargement.set(true);

    const donnees = {
      prenom: this.prenom,
      nom: this.nom,
      email: this.email,
      telephone: this.telephone || null,
      pavillon_id: this.besoinPavillon() && this.pavillonId ? Number(this.pavillonId) : null,
      specialite: this.role === 'medecin' ? (this.specialite || null) : null,
    };

    this.personnelService.modifierMembre(this.id, donnees).subscribe({
      next: () => {
        this.chargement.set(false);
        this.router.navigate(['/admin/personnel']);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors de la modification.');
      },
    });
  }
}