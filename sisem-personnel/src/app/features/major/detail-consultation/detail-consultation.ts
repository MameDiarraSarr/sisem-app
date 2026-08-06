import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';
import { Bulletin } from '../../../core/models/bulletin';

@Component({
  selector: 'app-major-detail-consultation',
  imports: [RouterLink],
  templateUrl: './detail-consultation.html',
  styleUrl: './detail-consultation.scss',
})
export class DetailConsultation implements OnInit {

  private route = inject(ActivatedRoute);
  private bulletinService = inject(BulletinService);

  bulletin = signal<Bulletin | null>(null);
  erreur = signal<string | null>(null);

  private id = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.bulletinService.getBulletin(this.id).subscribe({
      next: (b) => this.bulletin.set(b),
      error: () => this.erreur.set('Bulletin introuvable.'),
    });
  }

  imprimer(): void {
    window.print();
  }
}