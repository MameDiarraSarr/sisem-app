import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private patientService = inject(PatientService);

  // Le texte tapé dans la recherche
  recherche = signal('');

  // Tous les patients
  private tousLesPatients = this.patientService.getPatients();

  // Patients filtrés selon la recherche
  patients = computed(() => {
    const terme = this.recherche().toLowerCase().trim();
    if (!terme) return this.tousLesPatients;
    return this.tousLesPatients.filter(p =>
      p.prenom.toLowerCase().includes(terme) ||
      p.nom.toLowerCase().includes(terme) ||
      p.numeroLabo.toLowerCase().includes(terme)
    );
  });
}