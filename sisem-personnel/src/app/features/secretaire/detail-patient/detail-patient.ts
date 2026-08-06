import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PatientService } from '../../../core/services/patient';
import { BulletinService } from '../../../core/services/bulletin';
import { Patient } from '../../../core/models/patient';
import { Bulletin } from '../../../core/models/bulletin';

@Component({
  selector: 'app-detail-patient',
  imports: [RouterLink],
  templateUrl: './detail-patient.html',
  styleUrl: './detail-patient.scss',
})
export class DetailPatient implements OnInit {
  private patientService = inject(PatientService);
  private bulletinService = inject(BulletinService);
  private route = inject(ActivatedRoute);

  patient = signal<Patient | null>(null);
  bulletins = signal<Bulletin[]>([]);
  charge = signal(false);
  chargeBulletins = signal(false);
  erreur = signal<string | null>(null);

  private id = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.patientService.getPatient(this.id).subscribe({
      next: (p) => {
        this.patient.set(p);
        this.charge.set(true);
      },
      error: () => {
        this.erreur.set('Patient introuvable.');
        this.charge.set(true);
      },
    });

    this.bulletinService.getBulletinsDuPatient(this.id).subscribe({
      next: (liste) => {
        this.bulletins.set(liste);
        this.chargeBulletins.set(true);
      },
      error: () => this.chargeBulletins.set(true),
    });
  }

  statutLibelle(statut: string): string {
    const libelles: Record<string, string> = {
      enregistre: 'Enregistré', saisi: 'Saisi', valide: 'Validé',
    };
    return libelles[statut] ?? statut;
  }
}