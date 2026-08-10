import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  imports: [],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss',
})
export class Confirmation {
  message = input('Voulez-vous vraiment continuer ?');
  titre = input('Confirmation');

  confirme = output<void>();
  annule = output<void>();
}