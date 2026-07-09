import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';

@Component({
  selector: 'app-secretaire-examens',
  imports: [RouterLink, FormsModule],
  templateUrl: './examens.html',
  styleUrl: './examens.scss',
})
export class Examens {
  private bulletinService = inject(BulletinService);

  recherche = signal('');
  private tout = this.bulletinService.getBulletins();

  bulletins = computed(() => {
    const terme = this.recherche().toLowerCase().trim();
    if (!terme) return this.tout;
    return this.tout.filter(b =>
      b.patientNom.toLowerCase().includes(terme) ||
      b.numeroLabo.toLowerCase().includes(terme) ||
      b.nomExamen.toLowerCase().includes(terme)
    );
  });

  // Libellé + classe CSS selon le statut
  statutLibelle(statut: string): string {
    const libelles: Record<string, string> = {
      enregistre: 'Enregistré', saisi: 'Saisi', valide: 'Validé',
    };
    return libelles[statut] ?? statut;
  }
}