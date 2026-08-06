import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PersonnelService } from '../../../core/services/personnel';
import { MembrePersonnel } from '../../../core/models/membre-personnel';

@Component({
  selector: 'app-admin-personnel',
  imports: [RouterLink, FormsModule],
  templateUrl: './personnel.html',
  styleUrl: './personnel.scss',
})
export class Personnel implements OnInit {
  private personnelService = inject(PersonnelService);

  recherche = signal('');
  filtreRole = signal('');
  filtreStatut = signal('');

  private tousMembres = signal<MembrePersonnel[]>([]);

  ngOnInit(): void {
    this.charger();
  }

  private charger(): void {
    this.personnelService.getPersonnel().subscribe({
      next: (liste) => this.tousMembres.set(liste),
    });
  }

  membres = computed(() => {
    const terme = this.recherche().toLowerCase().trim();
    const role = this.filtreRole();
    const statut = this.filtreStatut();

    return this.tousMembres().filter(m => {
      const correspondRecherche = !terme ||
        m.prenom.toLowerCase().includes(terme) ||
        m.nom.toLowerCase().includes(terme) ||
        m.email.toLowerCase().includes(terme);
      const correspondRole = !role || m.role === role;
      const correspondStatut = !statut || m.statut === statut;
      return correspondRecherche && correspondRole && correspondStatut;
    });
  });

  roleLibelle(role: string): string {
    const libelles: Record<string, string> = {
      secretaire: 'Secrétaire', technicien: 'Technicien', biologiste: 'Biologiste',
      major: 'Major', medecin: 'Médecin',
    };
    return libelles[role] ?? role;
  }

  basculerStatut(id: number): void {
    this.personnelService.basculerStatut(id).subscribe({
      next: () => this.charger(), // recharge pour refléter le nouveau statut
    });
  }
}