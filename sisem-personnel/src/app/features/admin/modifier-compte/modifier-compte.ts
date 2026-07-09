import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { PersonnelService } from '../../../core/services/personnel';
import { MembrePersonnel } from '../../../core/models/membre-personnel';

@Component({
  selector: 'app-modifier-compte',
  imports: [RouterLink, FormsModule],
  templateUrl: './modifier-compte.html',
  styleUrl: './modifier-compte.scss',
})
export class ModifierCompte {

  private personnelService = inject(PersonnelService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private id = Number(this.route.snapshot.paramMap.get('id'));

  // On récupère le membre à modifier
  private membre = this.personnelService.getMembre(this.id);

  // Les champs pré-remplis
  prenom = this.membre?.prenom ?? '';
  nom = this.membre?.nom ?? '';
  email = this.membre?.email ?? '';
  telephone = this.membre?.telephone ?? '';
  role = this.membre?.role ?? '';
  pavillon = this.membre?.pavillon ?? '';

  besoinPavillon(): boolean {
    return this.role === 'major' || this.role === 'medecin';
  }

  enregistrer(): void {
    if (!this.prenom || !this.nom || !this.email || !this.role) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const membreModifie: MembrePersonnel = {
      id: this.id,
      prenom: this.prenom,
      nom: this.nom,
      email: this.email,
      telephone: this.telephone,
      role: this.role as MembrePersonnel['role'],
      pavillon: this.besoinPavillon() ? this.pavillon : null,
      statut: this.membre?.statut ?? 'actif',
    };

    this.personnelService.modifierMembre(membreModifie);
    alert('Compte modifié avec succès.');
    this.router.navigate(['/admin/personnel']);
  }
}