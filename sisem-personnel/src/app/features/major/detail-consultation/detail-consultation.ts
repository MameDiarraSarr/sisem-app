import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';
import { ExamenService } from '../../../core/services/examen';
import { AnalyseReference } from '../../../core/models/examen';

@Component({
  selector: 'app-major-detail-consultation',
  imports: [RouterLink],
  templateUrl: './detail-consultation.html',
  styleUrl: './detail-consultation.scss',
})
export class DetailConsultation {

  private route = inject(ActivatedRoute);
  private bulletinService = inject(BulletinService);
  private examenService = inject(ExamenService);

  bulletin = this.bulletinService.getBulletins().find(
    b => b.id === Number(this.route.snapshot.paramMap.get('id'))
  );

  // Les analyses de l'examen (dynamique via le catalogue)
  analyses = this.chargerAnalyses();

  private chargerAnalyses(): AnalyseReference[] {
    if (!this.bulletin) return [];
    const examen = this.examenService.getExamen(this.bulletin.examenId);
    return examen ? examen.analyses : [];
  }

  imprimer(): void {
    window.print();
  }
}