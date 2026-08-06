import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient';
import { Patient } from '../../../core/models/patient';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private patientService = inject(PatientService);

  recherche = signal('');

  // Les patients chargés depuis l'API, dans un signal
  private tousLesPatients = signal<Patient[]>([]);

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
}