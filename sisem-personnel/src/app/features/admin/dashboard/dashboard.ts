import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PersonnelService } from '../../../core/services/personnel';
import { MembrePersonnel } from '../../../core/models/membre-personnel';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private personnelService = inject(PersonnelService);

  private membres = signal<MembrePersonnel[]>([]);

  ngOnInit(): void {
    this.personnelService.getPersonnel().subscribe({
      next: (liste) => this.membres.set(liste),
    });
  }

  total = computed(() => this.membres().length);
  actifs = computed(() => this.membres().filter(m => m.statut === 'debloque').length);
  medecins = computed(() => this.membres().filter(m => m.role === 'medecin').length);

  repartition = computed(() => [
    { role: 'Secrétaires', nombre: this.membres().filter(m => m.role === 'secretaire').length },
    { role: 'Techniciens', nombre: this.membres().filter(m => m.role === 'technicien').length },
    { role: 'Biologistes', nombre: this.membres().filter(m => m.role === 'biologiste').length },
    { role: 'Majors', nombre: this.membres().filter(m => m.role === 'major').length },
    { role: 'Médecins', nombre: this.membres().filter(m => m.role === 'medecin').length },
  ]);
}