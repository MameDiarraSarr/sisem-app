import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';
import { Bulletin } from '../../../core/models/bulletin';

@Component({
  selector: 'app-secretaire-examens',
  imports: [RouterLink, FormsModule],
  templateUrl: './examens.html',
  styleUrl: './examens.scss',
})
export class Examens implements OnInit {
  private bulletinService = inject(BulletinService);

  recherche = signal('');
  charge = signal(false);
  private tout = signal<Bulletin[]>([]);

  ngOnInit(): void {
    this.bulletinService.getBulletins().subscribe({
      next: (liste) => {
        this.tout.set(liste);
        this.charge.set(true);
      },
      error: () => this.charge.set(true),
    });
  }

  bulletins = computed(() => {
    const terme = this.recherche().toLowerCase().trim();
    if (!terme) return this.tout();
    return this.tout().filter(b =>
      b.patient.nom_complet.toLowerCase().includes(terme) ||
      b.numero_labo.toLowerCase().includes(terme) ||
      b.examens.some(e => e.nom_examen.toLowerCase().includes(terme))
    );
  });

  statutLibelle(statut: string): string {
    const libelles: Record<string, string> = {
      enregistre: 'Enregistré', saisi: 'Saisi', valide: 'Validé',
    };
    return libelles[statut] ?? statut;
  }
}