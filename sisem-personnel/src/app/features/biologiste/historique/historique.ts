import { Component, inject, signal, OnInit } from '@angular/core';
import { BulletinService } from '../../../core/services/bulletin';
import { Bulletin } from '../../../core/models/bulletin';

@Component({
  selector: 'app-historique',
  imports: [],
  templateUrl: './historique.html',
  styleUrl: './historique.scss',
})
export class Historique implements OnInit {
  private bulletinService = inject(BulletinService);

  // Les bulletins validés (l'historique du biologiste)
  bulletins = signal<Bulletin[]>([]);

  charge = signal(false);

  ngOnInit(): void {
    this.bulletinService.getBulletins().subscribe({
      next: (liste) => {
        this.bulletins.set(liste.filter(b => b.statut === 'valide'));
        this.charge.set(true);
      },
      error: () => this.charge.set(true),
    });
  }
}