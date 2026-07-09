import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';

interface LigneAnalyse {
  nom: string;
  valeur: string;
  unite: string;
  reference: string;
}

@Component({
  selector: 'app-detail-consultation',
  imports: [RouterLink],
  templateUrl: './detail-consultation.html',
  styleUrl: './detail-consultation.scss',
})
export class DetailConsultation {

  private route = inject(ActivatedRoute);
  private bulletinService = inject(BulletinService);

  bulletin = this.bulletinService.getBulletins().find(
    b => b.id === Number(this.route.snapshot.paramMap.get('id'))
  );

  // ⚠️ Résultats fictifs (viendront du backend plus tard)
  analyses: LigneAnalyse[] = [
    { nom: 'Hémoglobine', valeur: '13.5', unite: 'g/dL', reference: '12 - 16' },
    { nom: 'Globules blancs', valeur: '7200', unite: '/mm³', reference: '4000 - 10000' },
    { nom: 'Plaquettes', valeur: '250000', unite: '/mm³', reference: '150000 - 400000' },
    { nom: 'Hématocrite', valeur: '41', unite: '%', reference: '37 - 47' },
  ];

  imprimer(): void {
    window.print();
  }
}