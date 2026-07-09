import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';
import { ExamenService } from '../../../core/services/examen';
import { AnalyseReference } from '../../../core/models/examen';

// Une ligne de saisie = l'analyse de référence + la valeur saisie
interface LigneSaisie {
  nom: string;
  unite: string;
  valeurReference: string;
  valeur: string;   // ce que le technicien saisit
}

@Component({
  selector: 'app-saisie-resultats',
  imports: [RouterLink, FormsModule],
  templateUrl: './saisie-resultats.html',
  styleUrl: './saisie-resultats.scss',
})
export class SaisieResultats {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bulletinService = inject(BulletinService);
  private examenService = inject(ExamenService);

  // Le bulletin en cours
  bulletin = this.bulletinService.getBulletins().find(
    b => b.id === Number(this.route.snapshot.paramMap.get('id'))
  );

  // Les analyses à saisir = celles de l'examen du bulletin (dynamique !)
  analyses: LigneSaisie[] = this.chargerAnalyses();

  commentaire = '';

  private chargerAnalyses(): LigneSaisie[] {
    if (!this.bulletin) return [];
    // On récupère l'examen du catalogue via son id
    const examen = this.examenService.getExamen(this.bulletin.examenId);
    if (!examen) return [];
    // On transforme chaque analyse de référence en ligne de saisie (valeur vide)
    return examen.analyses.map((a: AnalyseReference) => ({
      nom: a.nom,
      unite: a.unite,
      valeurReference: a.valeurReference,
      valeur: '',
    }));
  }

  enregistrerResultats(): void {
    console.log('Résultats saisis :', this.analyses, 'Commentaire :', this.commentaire);
    alert('Résultats enregistrés ! Le bulletin passe au statut "saisi" (orange).');
    this.router.navigate(['/technicien']);
  }
}