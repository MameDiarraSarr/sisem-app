import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';
import { Bulletin } from '../../../core/models/bulletin';

@Component({
  selector: 'app-secretaire-resultat',
  imports: [],
  templateUrl: './resultat.html',
  styleUrl: './resultat.scss',
})
export class Resultat implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bulletinService = inject(BulletinService);

  bulletin = signal<Bulletin | null>(null);
  erreur = signal<string | null>(null);

  private id = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.bulletinService.getBulletin(this.id).subscribe({
      next: (b) => this.bulletin.set(b),
      error: () => this.erreur.set('Résultat introuvable.'),
    });
  }

  retour(): void {
    this.router.navigate(['/secretaire']);
  }

  imprimer(): void {
    const b = this.bulletin();
    if (!b) return;

    this.bulletinService.marquerImprime(b.id).subscribe({
      next: (res) => {
        this.bulletin.set({ ...b, imprime_le: res.imprime_le, nombre_impressions: res.nombre_impressions });
        setTimeout(() => window.print(), 100);
      },
      error: () => {
        window.print();
      },
    });
  }
}