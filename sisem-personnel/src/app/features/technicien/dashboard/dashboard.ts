import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';
import { Bulletin } from '../../../core/models/bulletin';

@Component({
  selector: 'app-technicien-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private bulletinService = inject(BulletinService);

  // Les bulletins à traiter (statut = enregistre)
  bulletins = signal<Bulletin[]>([]);

  charge = signal(false);

  ngOnInit(): void {
    this.bulletinService.getBulletins().subscribe({
      next: (liste) => {
        this.bulletins.set(liste);
        this.charge.set(true);
      },
      error: () => this.charge.set(true),
    });
  }
}