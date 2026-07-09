import { Component, inject, signal } from '@angular/core';
import { PersonnelService } from '../../../core/services/personnel';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-major-medecins',
  imports: [],
  templateUrl: './medecins.html',
  styleUrl: './medecins.scss',
})
export class Medecins {
  private personnelService = inject(PersonnelService);
  private auth = inject(Auth);

  pavillon = this.auth.utilisateurConnecte()?.pavillon ?? '';

  private version = signal(0);

  // Les médecins de SON pavillon
  medecins = () => {
    this.version();
    return this.personnelService.getPersonnel().filter(
      m => m.role === 'medecin' && m.pavillon === this.pavillon
    );
  };

  basculerStatut(id: number): void {
    this.personnelService.basculerStatut(id);
    this.version.update(v => v + 1);
  }
}