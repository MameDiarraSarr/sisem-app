import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PersonnelService } from '../../../core/services/personnel';
import { MembrePersonnel } from '../../../core/models/membre-personnel';

@Component({
  selector: 'app-nouveau-compte',
  imports: [RouterLink, FormsModule],
  templateUrl: './nouveau-compte.html',
  styleUrl: './nouveau-compte.scss',
})
export class NouveauCompte {

  prenom = '';
  nom = '';
  email = '';
  telephone = '';
  role = '';
  pavillon = '';

  private personnelService = inject(PersonnelService);
  private router = inject(Router);

  // Le pavillon n'est requis que pour major et médecin
  besoinPavillon(): boolean {
    return this.role === 'major' || this.role === 'medecin';
  }

  enregistrer(): void {
    if (!this.prenom || !this.nom || !this.email || !this.role) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const membre: MembrePersonnel = {
      id: Date.now(),
      prenom: this.prenom,
      nom: this.nom,
      email: this.email,
      telephone: this.telephone,
      role: this.role as MembrePersonnel['role'],
      pavillon: this.besoinPavillon() ? this.pavillon : null,
      statut: 'actif',
    };

    this.personnelService.ajouterMembre(membre);
    alert('Compte créé ! Un mot de passe temporaire sera remis au membre.');
    this.router.navigate(['/admin']);
  }
}