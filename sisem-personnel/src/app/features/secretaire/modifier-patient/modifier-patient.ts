import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PatientService, NouveauPatientDto } from '../../../core/services/patient';
import { environment } from '../../../../environments/environment';

interface Pavillon {
  id: number;
  nom: string;
}

@Component({
  selector: 'app-modifier-patient',
  imports: [RouterLink, FormsModule],
  templateUrl: './modifier-patient.html',
  styleUrl: './modifier-patient.scss',
})
export class ModifierPatient implements OnInit {

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

  id = 0;

  pavillons = signal<Pavillon[]>([]);
  chargement = signal(false);
  chargePatient = signal(false);
  erreur = signal<string | null>(null);

  private patientService = inject(PatientService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.http.get<Pavillon[]>(`${environment.apiUrl}/pavillons`).subscribe({
      next: (liste) => this.pavillons.set(liste),
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.chargerPatient();
  }

  private chargerPatient(): void {
    this.patientService.getPatient(this.id).subscribe({
      next: (p) => {
        this.prenom = p.prenom;
        this.nom = p.nom;
        this.sexe = p.sexe ?? '';
        this.telephone = p.telephone;
        this.email = p.email ?? '';
        this.adresse = p.adresse ?? '';
        this.ville = p.ville ?? '';
        this.typePatient = p.type_patient;
        this.pavillonId = p.pavillon_id ? String(p.pavillon_id) : '';

        // L'âge revient sous forme de chaîne ("8 ans", "5 mois") : on le décompose
        if (p.age) {
          const [valeur, unite] = p.age.split(' ');
          this.ageValeur = valeur;
          this.ageUnite = unite === 'mois' ? 'mois' : 'ans';
        }

        this.chargePatient.set(true);
        this.cdr.markForCheck();
      },
      error: () => {
        this.erreur.set('Patient introuvable.');
        this.chargePatient.set(true);
        this.cdr.markForCheck();
      },
    });
  }

  enregistrer(): void {
    if (!this.prenom || !this.nom || !this.telephone) {
      this.erreur.set('Le prénom, le nom et le téléphone sont obligatoires.');
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

    const dto: Partial<NouveauPatientDto> = {
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
      type_patient: this.typePatient as 'interne' | 'externe',
      pavillon_id: this.typePatient === 'interne' && this.pavillonId ? Number(this.pavillonId) : null,
    };

    this.patientService.modifierPatient(this.id, dto).subscribe({
      next: () => {
        this.chargement.set(false);
        this.router.navigate(['/secretaire/patient', this.id]);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors de la modification.');
      },
    });
  }
}