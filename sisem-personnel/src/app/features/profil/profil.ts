import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfilService, ProfilPersonnel } from '../../core/services/profil';

@Component({
  selector: 'app-profil',
  imports: [FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.scss',
})
export class Profil implements OnInit {
  private profilService = inject(ProfilService);

  profil = signal<ProfilPersonnel | null>(null);
  charge = signal(false);
  enregistrement = signal(false);
  message = signal<string | null>(null);
  erreur = signal<string | null>(null);

  email = '';
  telephone = '';
  adresse = '';

  ngOnInit(): void {
    this.profilService.getProfil().subscribe({
      next: (p) => {
        this.profil.set(p);
        this.email = p.email ?? '';
        this.telephone = p.telephone ?? '';
        this.adresse = p.adresse ?? '';
        this.charge.set(true);
      },
      error: () => this.charge.set(true),
    });
  }

  enregistrer(): void {
    this.message.set(null);
    this.erreur.set(null);
    this.enregistrement.set(true);

    this.profilService.modifierProfil({
      email: this.email,
      telephone: this.telephone || null,
      adresse: this.adresse || null,
    }).subscribe({
      next: (r) => {
        this.enregistrement.set(false);
        this.message.set(r.message);
      },
      error: (err) => {
        this.enregistrement.set(false);
        this.erreur.set(err.error?.message ?? 'Erreur lors de la mise à jour.');
      },
    });
  }
}