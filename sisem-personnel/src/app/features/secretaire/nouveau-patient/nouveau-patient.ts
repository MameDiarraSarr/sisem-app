import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient';
import { Patient } from '../../../core/models/patient';

@Component({
  selector: 'app-nouveau-patient',
  imports: [RouterLink, FormsModule],
  templateUrl: './nouveau-patient.html',
  styleUrl: './nouveau-patient.scss',
})
export class NouveauPatient {

  prenom = '';
  nom = '';
  dateNaissance = '';
  sexe = '';
  telephone = '';
  email = '';
  adresse = '';
  ville = '';
  typePatient = '';
  pavillon = '';

  private patientService = inject(PatientService);
  private router = inject(Router);

  private calculerAge(dateNaiss: string): number {
    if (!dateNaiss) return 0;
    const naissance = new Date(dateNaiss);
    const aujourdhui = new Date();
    let age = aujourdhui.getFullYear() - naissance.getFullYear();
    const mois = aujourdhui.getMonth() - naissance.getMonth();
    if (mois < 0 || (mois === 0 && aujourdhui.getDate() < naissance.getDate())) {
      age--;
    }
    return age;
  }

  // Le numéro de dossier est généré par le système, pas saisi
  private genererNumeroDossier(): string {
    const total = this.patientService.getPatients().length + 1;
    return 'DOS-' + String(total).padStart(4, '0');
  }

  enregistrer(): void {
    if (!this.prenom || !this.nom || !this.telephone) {
      alert('Le prénom, le nom et le téléphone sont obligatoires.');
      return;
    }

    const nouvelId = Date.now();

    const nouveauPatient: Patient = {
      id: nouvelId,
      prenom: this.prenom,
      nom: this.nom,
      dateNaissance: this.dateNaissance,
      age: this.calculerAge(this.dateNaissance),
      sexe: this.sexe === 'M' ? 'M' : this.sexe === 'F' ? 'F' : '',
      telephone: this.telephone,
      email: this.email || null,
      adresse: this.adresse,
      ville: this.ville,
      numeroDossier: this.genererNumeroDossier(),
      typePatient: this.typePatient === 'interne' ? 'interne' : 'externe',
      pavillon: this.typePatient === 'interne' ? this.pavillon : null,
      dateEnregistrement: new Date().toLocaleDateString('fr-FR'),
    };

    this.patientService.ajouterPatient(nouveauPatient);
    this.router.navigate(['/secretaire/nouveau-bulletin', nouvelId]);
  }
}