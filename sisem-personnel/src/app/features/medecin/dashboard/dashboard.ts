import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';

@Component({
  selector: 'app-medecin-dashboard',
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private bulletinService = inject(BulletinService);

  recherche = signal('');

  private tousLesBulletins = this.bulletinService.getBulletinsValides();

  bulletins = computed(() => {
    const terme = this.recherche().toLowerCase().trim();
    if (!terme) return this.tousLesBulletins;
    return this.tousLesBulletins.filter(b =>
      b.patientNom.toLowerCase().includes(terme) ||
      b.numeroLabo.toLowerCase().includes(terme)
    );
  });
}