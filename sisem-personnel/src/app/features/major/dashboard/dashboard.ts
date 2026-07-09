import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-major-dashboard',
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private bulletinService = inject(BulletinService);
  private auth = inject(Auth);

  // Le pavillon du major connecté
  pavillon = this.auth.utilisateurConnecte()?.pavillon ?? '';

  recherche = signal('');

  // Les résultats validés de SON pavillon
  private tousLesBulletins = this.bulletinService.getBulletinsValidesParPavillon(this.pavillon);

  bulletins = computed(() => {
    const terme = this.recherche().toLowerCase().trim();
    if (!terme) return this.tousLesBulletins;
    return this.tousLesBulletins.filter(b =>
      b.patientNom.toLowerCase().includes(terme) ||
      b.numeroLabo.toLowerCase().includes(terme)
    );
  });
}