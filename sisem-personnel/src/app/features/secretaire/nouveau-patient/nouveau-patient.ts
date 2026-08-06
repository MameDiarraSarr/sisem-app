import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PatientService, NouveauPatientDto } from '../../../core/services/patient';
import { environment } from '../../../../environments/environment';

interface Pavillon {
  id: number;
  nom: string;
}

@Component({
  selector: 'app-nouveau-patient',
  imports: [RouterLink, FormsModule],
  templateUrl: './nouveau-patient.html',
  styleUrl: './nouveau-patient.scss',
})
export class NouveauPatient implements OnInit {

  prenom = '';
  nom = '';
  ageValeur = '';
  ageUnite = 'ans';
  sexe = '';
  telephone = '';
  email = '';
  adresse = '';
  ville = '';
  typePatient = '';
  pavillonId = '';

  pavillons = signal<Pavillon[]>([]);
  chargement = signal(false);
  erreur = signal<string | null>(null);

  private patientService = inject(PatientService);
  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit(): void {
    // Charge la liste des pavillons pour le menu déroulant
    this.http.get<Pavillon[]>(`${environment.apiUrl}/pavillons`).subscribe({
      next: (liste) => this.pavillons.set(liste),
      error: () => this.erreur.set('Impossible de charger les pavillons.'),
    });
  }

  enregistrer(): void {
    if (!this.prenom || !this.nom || !this.telephone || !this.typePatient) {
      this.erreur.set('Le prénom, le nom, le téléphone et le type sont obligatoires.');
      return;
    }
    if (!this.sexe) {
      this.erreur.set('Le sexe est obligatoire.');
      return;
    }
    if (!this.ageValeur) {
      this.erreur.set('L\'âge du patient est obligatoire.');
      return;
    }
    if (this.typePatient === 'interne' && !this.pavillonId) {
      this.erreur.set('Un patient interne doit être rattaché à un pavillon.');
      return;
    }

    this.erreur.set(null);
    this.chargement.set(true);

    const dto: NouveauPatientDto = {
      prenom: this.prenom,
      nom: this.nom,
      date_naissance: null,
      age_valeur: Number(this.ageValeur),
      age_unite: this.ageUnite as 'ans' | 'mois',
      sexe: this.sexe as 'M' | 'F',
      telephone: this.telephone,
      email: this.email || null,
      adresse: this.adresse || null,
      ville: this.ville || null,
      type_patient: this.typePatient === 'interne' ? 'interne' : 'externe',
      pavillon_id: this.typePatient === 'interne' ? Number(this.pavillonId) : null,
    };

    this.patientService.ajouterPatient(dto).subscribe({
      next: (patient) => {
        this.chargement.set(false);
        this.router.navigate(['/secretaire/nouveau-bulletin', patient.id]);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors de l\'enregistrement.');
      },
    });
  }
}