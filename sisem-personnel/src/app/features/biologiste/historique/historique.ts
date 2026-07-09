import { Component, inject } from '@angular/core';
import { BulletinService } from '../../../core/services/bulletin';

@Component({
  selector: 'app-historique',
  imports: [],
  templateUrl: './historique.html',
  styleUrl: './historique.scss',
})
export class Historique {
  private bulletinService = inject(BulletinService);

  // Les bulletins validés (l'historique du biologiste)
  bulletins = this.bulletinService.getBulletinsValides();
}