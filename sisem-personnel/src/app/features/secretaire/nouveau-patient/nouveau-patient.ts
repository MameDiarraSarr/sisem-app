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
  numeroLabo = '';
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

  enregistrer(): void {
    if (!this.prenom || !this.nom) {
      alert('Le prénom et le nom sont obligatoires.');
      return;
    }

    // On génère l'id du patient (pour pouvoir le passer au formulaire d'examen)
    const nouvelId = Date.now();

    const nouveauPatient: Patient = {
      id: nouvelId,
      prenom: this.prenom,
      nom: this.nom,
      age: this.calculerAge(this.dateNaissance),
      numeroLabo: this.numeroLabo,
      typePatient: this.typePatient === 'interne' ? 'interne' : 'externe',
      pavillon: this.typePatient === 'interne' ? this.pavillon : null,
      dateEnregistrement: new Date().toLocaleDateString('fr-FR'),
    };

    this.patientService.ajouterPatient(nouveauPatient);

    // On redirige DIRECTEMENT vers le formulaire d'examen de ce patient
    this.router.navigate(['/secretaire/nouveau-bulletin', nouvelId]);
  }
}