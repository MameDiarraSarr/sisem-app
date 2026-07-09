import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PersonnelService } from '../../../core/services/personnel';

@Component({
  selector: 'app-admin-affectations',
  imports: [FormsModule],
  templateUrl: './affectations.html',
  styleUrl: './affectations.scss',
})
export class Affectations {
  private personnelService = inject(PersonnelService);

  membres = signal(this.personnelService.getPersonnelAffectable());

  pavillons = ['Pavillon M', 'Pavillon N', 'Pavillon O', 'Pavillon K', 'USAD', 'SAU', 'Dermato', 'Esther', 'Chirurgie', 'Chir Ped'];

  roleLibelle(role: string): string {
    return role === 'medecin' ? 'Médecin' : 'Major';
  }

  changer(id: number, pavillon: string): void {
    this.personnelService.changerAffectation(id, pavillon);
    this.membres.set([...this.personnelService.getPersonnelAffectable()]);
  }
}