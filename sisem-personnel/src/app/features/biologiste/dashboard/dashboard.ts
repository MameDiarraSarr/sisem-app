import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin';

@Component({
  selector: 'app-biologiste-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private bulletinService = inject(BulletinService);

  // Les bulletins à valider (statut orange = saisi)
  bulletins = this.bulletinService.getBulletinsAValider();
}