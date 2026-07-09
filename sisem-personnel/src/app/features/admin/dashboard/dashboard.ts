import { Component, inject } from '@angular/core';
import { PersonnelService } from '../../../core/services/personnel';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private personnelService = inject(PersonnelService);

  private membres = this.personnelService.getPersonnel();

  // Statistiques calculées
  total = this.membres.length;
  actifs = this.membres.filter(m => m.statut === 'actif').length;
  medecins = this.membres.filter(m => m.role === 'medecin').length;

  // Répartition par rôle
  repartition = [
    { role: 'Secrétaires', nombre: this.membres.filter(m => m.role === 'secretaire').length },
    { role: 'Techniciens', nombre: this.membres.filter(m => m.role === 'technicien').length },
    { role: 'Biologistes', nombre: this.membres.filter(m => m.role === 'biologiste').length },
    { role: 'Majors', nombre: this.membres.filter(m => m.role === 'major').length },
    { role: 'Médecins', nombre: this.membres.filter(m => m.role === 'medecin').length },
  ];
}