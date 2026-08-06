import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BulletinService } from '../../../core/services/bulletin';
import { Bulletin } from '../../../core/models/bulletin';
import { environment } from '../../../../environments/environment';

// Une ligne de saisie par analyse — on garde l'examen_demande_id auquel elle appartient
interface LigneSaisie {
  examen_demande_id: number;
  analyse_reference_id: number;
  nom_analyse: string;
  unite: string;
  valeur_normale: string;
  valeur: string;   // ce que le technicien saisit
}

@Component({
  selector: 'app-saisie-resultats',
  imports: [RouterLink, FormsModule],
  templateUrl: './saisie-resultats.html',
  styleUrl: './saisie-resultats.scss',
})
export class SaisieResultats implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private bulletinService = inject(BulletinService);

  bulletin = signal<Bulletin | null>(null);
  lignes = signal<LigneSaisie[]>([]);
  chargement = signal(false);
  erreur = signal<string | null>(null);

  private id = Number(this.route.snapshot.paramMap.get('id'));

  ngOnInit(): void {
    this.bulletinService.getBulletin(this.id).subscribe({
      next: (b) => {
        this.bulletin.set(b);
        // Aplatir toutes les analyses de tous les examens en lignes de saisie,
        // en gardant l'examen_demande_id de chaque examen
        const lignes: LigneSaisie[] = [];
        for (const examen of b.examens) {
          for (const a of (examen as any).analyses ?? []) {
            lignes.push({
              examen_demande_id: examen.examen_demande_id,
              analyse_reference_id: a.analyse_reference_id,
              nom_analyse: a.nom_analyse,
              unite: a.unite,
              valeur_normale: a.valeur_normale,
              valeur: '',
            });
          }
        }
        this.lignes.set(lignes);
      },
      error: () => this.erreur.set('Bulletin introuvable.'),
    });
  }

  enregistrerResultats(): void {
    if (this.lignes().some(l => !l.valeur.trim())) {
      this.erreur.set('Veuillez saisir toutes les valeurs.');
      return;
    }

    this.erreur.set(null);
    this.chargement.set(true);

    const resultats = this.lignes().map(l => ({
      examen_demande_id: l.examen_demande_id,
      analyse_reference_id: l.analyse_reference_id,
      valeur_resultat: l.valeur,
    }));

    this.http.post(`${environment.apiUrl}/bulletins/${this.id}/resultats`, { resultats }).subscribe({
      next: () => {
        this.chargement.set(false);
        this.router.navigate(['/technicien']);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors de l\'enregistrement.');
      },
    });
  }
}