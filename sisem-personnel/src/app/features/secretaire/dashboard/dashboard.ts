import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient';
import { Patient } from '../../../core/models/patient';
import { BulletinService } from '../../../core/services/bulletin';
import { Bulletin } from '../../../core/models/bulletin';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private patientService = inject(PatientService);
  private bulletinService = inject(BulletinService);

  recherche = signal('');

  // Les patients chargés depuis l'API, dans un signal
  private tousLesPatients = signal<Patient[]>([]);

  // Les bulletins chargés depuis l'API, dans un signal
  private tousLesBulletins = signal<Bulletin[]>([]);

  chargement = signal(false);
  erreur = signal<string | null>(null);

  ngOnInit(): void {
    this.chargement.set(true);
    this.patientService.getPatients().subscribe({
      next: (liste) => {
        this.tousLesPatients.set(liste);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les patients.');
        this.chargement.set(false);
      },
    });

    this.bulletinService.getBulletins().subscribe({
      next: (liste) => this.tousLesBulletins.set(liste),
      error: () => {}, // on n'affiche pas d'erreur bloquante pour ça
    });
  }

  // Patients filtrés selon la recherche
  patients = computed(() => {
    const terme = this.recherche().toLowerCase().trim();
    if (!terme) return this.tousLesPatients();
    return this.tousLesPatients().filter(p =>
      p.prenom.toLowerCase().includes(terme) ||
      p.nom.toLowerCase().includes(terme) ||
      (p.numero_dossier?.toLowerCase().includes(terme) ?? false)
    );
  });

  // Patients enregistrés aujourd'hui
  patientsAujourdhui = computed(() => {
  const aujourdhui = new Date();
  const jourStr = String(aujourdhui.getDate()).padStart(2, '0');
  const moisStr = String(aujourdhui.getMonth() + 1).padStart(2, '0');
  const anneeStr = String(aujourdhui.getFullYear());
  const aujourdhuiFr = `${jourStr}/${moisStr}/${anneeStr}`; // "19/08/2026"

  return this.tousLesPatients().filter(p =>
    p.date_enregistrement === aujourdhuiFr
  ).length;
});

  // Patients qui n'ont encore aucun bulletin créé
  patientsSansBulletin = computed(() => {
    const idsAvecBulletin = new Set(this.tousLesBulletins().map(b => b.patient.id));
    return this.tousLesPatients().filter(p => !idsAvecBulletin.has(p.id)).length;
  });
}