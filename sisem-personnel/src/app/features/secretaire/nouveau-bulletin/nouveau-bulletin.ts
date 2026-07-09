import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';
import { PatientService } from '../../../core/services/patient';
import { PersonnelService } from '../../../core/services/personnel';
import { ExamenService } from '../../../core/services/examen';
import { Bulletin } from '../../../core/models/bulletin';

@Component({
  selector: 'app-nouveau-bulletin',
  imports: [RouterLink, FormsModule],
  templateUrl: './nouveau-bulletin.html',
  styleUrl: './nouveau-bulletin.scss',
})
export class NouveauBulletin {

  private bulletinService = inject(BulletinService);
  private patientService = inject(PatientService);
  private personnelService = inject(PersonnelService);
  private examenService = inject(ExamenService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  patients = this.patientService.getPatients();
  private tousMedecins = this.personnelService.getMedecins();
  private tousExamens = this.examenService.getExamens();

  patientId = this.route.snapshot.paramMap.get('patientId') ?? '';

  numeroLabo = '';
  indication = '';
  traitementEnCours = '';

  patientChoisi = computed(() => {
    return this.patients.find(p => p.id === Number(this.patientId));
  });

  // Autocomplétion EXAMEN
  rechercheExamen = signal('');
  examenChoisiId = signal<number | null>(null);
  examenChoisiNom = signal('');
  listeExamenVisible = signal(false);

  examensFiltres = computed(() => {
    const terme = this.rechercheExamen().toLowerCase().trim();
    if (!terme) return this.tousExamens;
    return this.tousExamens.filter(e => e.nom.toLowerCase().includes(terme));
  });

  // Autocomplétion MÉDECIN
  rechercheMedecin = signal('');
  medecinChoisiId = signal<number | null>(null);
  listeMedecinVisible = signal(false);

  medecinsFiltres = computed(() => {
    const terme = this.rechercheMedecin().toLowerCase().trim();
    if (!terme) return this.tousMedecins;
    return this.tousMedecins.filter(m =>
      m.prenom.toLowerCase().includes(terme) ||
      m.nom.toLowerCase().includes(terme)
    );
  });

  patientEstInterne(): boolean {
    return this.patientChoisi()?.typePatient === 'interne';
  }

  onRechercheExamen(valeur: string): void {
    this.rechercheExamen.set(valeur);
    this.examenChoisiId.set(null);
    this.listeExamenVisible.set(true);
  }
  choisirExamen(id: number, nom: string): void {
    this.examenChoisiId.set(id);
    this.examenChoisiNom.set(nom);
    this.rechercheExamen.set(nom);
    this.listeExamenVisible.set(false);
  }

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
    if (!this.patientId || !this.numeroLabo || !this.examenChoisiId() || !this.indication) {
      alert('Veuillez remplir les champs obligatoires (examen inclus).');
      return;
    }

    const patient = this.patientChoisi();
    if (!patient) return;

    const nouveauBulletin: Bulletin = {
      id: Date.now(),
      numeroLabo: this.numeroLabo,
      patientNom: `${patient.prenom} ${patient.nom}`,
      pavillon: patient.pavillon,
      examenId: this.examenChoisiId()!,
      nomExamen: this.examenChoisiNom(),
      indication: this.indication,
      traitementEnCours: this.traitementEnCours || null,
      medecinPrescripteurId: patient.typePatient === 'interne' ? this.medecinChoisiId() : null,
      dateEnregistrement: new Date().toLocaleDateString('fr-FR'),
      statut: 'enregistre',
    };

    this.bulletinService.ajouterBulletin(nouveauBulletin);
    alert('Bulletin créé ! Il apparaît dans la liste des examens (statut Enregistré).');
    this.router.navigate(['/secretaire/examens']);
  }
}