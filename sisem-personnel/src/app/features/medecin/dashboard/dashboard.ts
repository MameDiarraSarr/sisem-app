import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';
import { Bulletin } from '../../../core/models/bulletin';

@Component({
  selector: 'app-medecin-dashboard',
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private bulletinService = inject(BulletinService);

  recherche = signal('');
  charge = signal(false);
  private tousLesBulletins = signal<Bulletin[]>([]);

  ngOnInit(): void {
    // L'API renvoie déjà uniquement les bulletins validés dont ce médecin est prescripteur
    this.bulletinService.getBulletins().subscribe({
      next: (liste) => {
        this.tousLesBulletins.set(liste);
        this.charge.set(true);
      },
      error: () => this.charge.set(true),
    });
  }

  bulletins = computed(() => {
    const terme = this.recherche().toLowerCase().trim();
    if (!terme) return this.tousLesBulletins();
    return this.tousLesBulletins().filter(b =>
      b.patient.nom_complet.toLowerCase().includes(terme) ||
      b.numero_labo.toLowerCase().includes(terme)
    );
  });
}