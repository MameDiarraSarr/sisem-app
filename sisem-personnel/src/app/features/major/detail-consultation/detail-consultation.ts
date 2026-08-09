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

  statutValeur(valeur: string, reference: string): 'normal' | 'anormal' | 'qualitatif' {
    const val = parseFloat(String(valeur).replace(',', '.'));
    const bornes = String(reference).split('-').map(b => parseFloat(b.trim().replace(',', '.')));

    // Cas numérique : référence du type "135 - 145"
    if (!isNaN(val) && bornes.length === 2 && !bornes.some(isNaN)) {
      const [min, max] = bornes;
      return (val >= min && val <= max) ? 'normal' : 'anormal';
    }

    // Cas qualitatif : référence texte (ex. "Négatif")
    const normaliser = (s: string) =>
      String(s).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (valeur && reference) {
      return normaliser(valeur) === normaliser(reference) ? 'normal' : 'anormal';
    }

    return 'qualitatif';
  }
}