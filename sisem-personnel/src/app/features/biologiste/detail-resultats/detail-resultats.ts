import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';
import { Bulletin } from '../../../core/models/bulletin';

@Component({
  selector: 'app-detail-resultats',
  imports: [RouterLink],
  templateUrl: './detail-resultats.html',
  styleUrl: './detail-resultats.scss',
})
export class DetailResultats implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bulletinService = inject(BulletinService);

  bulletin = signal<Bulletin | null>(null);
  chargement = signal(false);
  erreur = signal<string | null>(null);

  private id = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.bulletinService.getBulletin(this.id).subscribe({
      next: (b) => this.bulletin.set(b),
      error: () => this.erreur.set('Bulletin introuvable.'),
    });
  }

  valider(): void {
    this.chargement.set(true);
    this.bulletinService.validerBulletin(this.id).subscribe({
      next: () => {
        this.chargement.set(false);
        this.router.navigate(['/biologiste']);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors de la validation.');
      },
    });
  }

  renvoyer(): void {
    this.chargement.set(true);
    this.bulletinService.renvoyerBulletin(this.id).subscribe({
      next: () => {
        this.chargement.set(false);
        this.router.navigate(['/biologiste']);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors du renvoi.');
      },
    });
  }
}