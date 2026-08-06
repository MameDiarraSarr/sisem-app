import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { BulletinService, NouveauBulletinDto } from '../../../core/services/bulletin';
import { PatientService } from '../../../core/services/patient';
import { PersonnelService, Medecin } from '../../../core/services/personnel';
import { ExamenService } from '../../../core/services/examen';
import { Patient } from '../../../core/models/patient';
import { Examen } from '../../../core/models/examen';

@Component({
  selector: 'app-nouveau-bulletin',
  imports: [RouterLink, FormsModule],
  templateUrl: './nouveau-bulletin.html',
  styleUrl: './nouveau-bulletin.scss',
})
export class NouveauBulletin implements OnInit {

  private bulletinService = inject(BulletinService);
  private patientService = inject(PatientService);
  private personnelService = inject(PersonnelService);
  private examenService = inject(ExamenService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  patientId = this.route.snapshot.paramMap.get('patientId') ?? '';

  numeroLabo = '';
  indication = '';
  traitementEnCours = '';

  chargement = signal(false);
  chargementPatient = signal(true);
  erreur = signal<string | null>(null);

  private patientCourant = signal<Patient | null>(null);
  private tousMedecins = signal<Medecin[]>([]);
  private tousExamens = signal<Examen[]>([]);

  ngOnInit(): void {
    if (this.patientId) {
      this.patientService.getPatient(Number(this.patientId)).subscribe({
        next: (p) => {
          this.patientCourant.set(p);
          this.chargementPatient.set(false);
        },
        error: () => {
          this.erreur.set('Patient introuvable.');
          this.chargementPatient.set(false);
        },
      });
    } else {
      this.chargementPatient.set(false);
    }

    this.personnelService.getMedecins().subscribe({
      next: (liste) => this.tousMedecins.set(liste),
    });

    this.examenService.getExamens().subscribe({
      next: (liste) => this.tousExamens.set(liste),
    });
  }

  patientChoisi = computed(() => this.patientCourant());

  patientEstInterne(): boolean {
    return this.patientChoisi()?.type_patient === 'interne';
  }

  // Autocomplétion EXAMEN (plusieurs examens possibles par bulletin)
  rechercheExamen = signal('');
  examensChoisis = signal<{ id: number; nom: string }[]>([]);
  listeExamenVisible = signal(false);

  examensFiltres = computed(() => {
    const terme = this.rechercheExamen().toLowerCase().trim();
    // On n'affiche pas les examens déjà choisis
    const dejaChoisis = this.examensChoisis().map(e => e.id);
    const disponibles = this.tousExamens().filter(e => !dejaChoisis.includes(e.id));
    if (!terme) return disponibles;
    return disponibles.filter(e => e.nom_examen.toLowerCase().includes(terme));
  });

  onRechercheExamen(valeur: string): void {
    this.rechercheExamen.set(valeur);
    this.listeExamenVisible.set(true);
  }

  choisirExamen(id: number, nom: string): void {
    // Évite d'ajouter deux fois le même examen
    if (!this.examensChoisis().some(e => e.id === id)) {
      this.examensChoisis.update(liste => [...liste, { id, nom }]);
    }
    this.rechercheExamen.set('');
    this.listeExamenVisible.set(false);
  }

  retirerExamen(id: number): void {
    this.examensChoisis.update(liste => liste.filter(e => e.id !== id));
  }

  // Autocomplétion MÉDECIN
  rechercheMedecin = signal('');
  medecinChoisiId = signal<number | null>(null);
  listeMedecinVisible = signal(false);

  medecinsFiltres = computed(() => {
    const terme = this.rechercheMedecin().toLowerCase().trim();
    if (!terme) return this.tousMedecins();
    return this.tousMedecins().filter(m =>
      m.prenom.toLowerCase().includes(terme) ||
      m.nom.toLowerCase().includes(terme)
    );
  });

  onRechercheMedecin(valeur: string): void {
    this.rechercheMedecin.set(valeur);
    this.medecinChoisiId.set(null);
    this.listeMedecinVisible.set(true);
  }
  choisirMedecin(id: number, nomComplet: string): void {
    this.medecinChoisiId.set(id);
    this.rechercheMedecin.set(nomComplet);
    this.listeMedecinVisible.set(false);
  }

  enregistrer(): void {
    if (!this.patientId || !this.numeroLabo || this.examensChoisis().length === 0 || !this.indication) {
      this.erreur.set('Veuillez remplir les champs obligatoires (au moins un examen).');
      return;
    }

    this.erreur.set(null);
    this.chargement.set(true);

    const dto: NouveauBulletinDto = {
      numero_labo: this.numeroLabo,
      patient_id: Number(this.patientId),
      medecin_id: this.patientEstInterne() ? this.medecinChoisiId() : null,
      indication_examen: this.indication,
      traitement_en_cours: this.traitementEnCours || null,
      examens: this.examensChoisis().map(e => e.id),
    };

    this.bulletinService.ajouterBulletin(dto).subscribe({
      next: () => {
        this.chargement.set(false);
        this.router.navigate(['/secretaire/examens']);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors de la création du bulletin.');
      },
    });
  }
}