import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/services/auth';
import { ProfilService, ProfilPatient } from '../../../core/services/profil';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-profil',
  imports: [FormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.scss',
})
export class Profil implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  private http = inject(HttpClient);
  private profilService = inject(ProfilService);
  private cdr = inject(ChangeDetectorRef);

  profil = signal<ProfilPatient | undefined>(undefined);
  chargement = signal(true);

  // Accordéons
  sectionInfos = signal(true);
  sectionMdp = signal(false);

  // Champs infos modifiables
  telephone = signal('');
  email = signal('');
  adresse = signal('');
  modeEdition = signal(false);
  message = signal('');
  erreur = signal('');
  enregistrement = signal(false);

  // Champs mot de passe
  ancien = '';
  nouveau = '';
  confirmation = '';
  erreurMdp = signal('');
  messageMdp = signal('');
  chargementMdp = signal(false);

  ngOnInit(): void {
    this.profilService.afficher().subscribe({
      next: (p) => {
        this.profil.set(p);
        this.telephone.set(p.telephone ?? '');
        this.email.set(p.email ?? '');
        this.adresse.set(p.adresse ?? '');
        this.chargement.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.chargement.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  basculerInfos(): void { this.sectionInfos.update(v => !v); }
  basculerMdp(): void { this.sectionMdp.update(v => !v); }

  initiales(): string {
    const p = this.profil();
    if (!p) return '';
    return ((p.prenom[0] ?? '') + (p.nom[0] ?? '')).toUpperCase();
  }

  sexeLisible(): string {
    const s = this.profil()?.sexe;
    return s === 'M' ? 'Masculin' : s === 'F' ? 'Féminin' : '—';
  }

  activerEdition(): void {
    this.modeEdition.set(true);
    this.message.set('');
    this.erreur.set('');
  }

  annulerEdition(): void {
    const p = this.profil();
    this.telephone.set(p?.telephone ?? '');
    this.email.set(p?.email ?? '');
    this.adresse.set(p?.adresse ?? '');
    this.modeEdition.set(false);
    this.erreur.set('');
  }

  enregistrer(): void {
    const p = this.profil();
    if (!p) return;

    this.enregistrement.set(true);
    this.erreur.set('');
    this.message.set('');

    this.profilService.modifier({
      telephone: this.telephone(),
      email: this.email() || null,
      adresse: this.adresse() || null,
      ville: p.ville ?? null,
    }).subscribe({
      next: () => {
        this.profil.set({ ...p, telephone: this.telephone(), email: this.email() || null, adresse: this.adresse() || null });
        this.modeEdition.set(false);
        this.enregistrement.set(false);
        this.message.set('Informations mises à jour.');
        this.cdr.markForCheck();
      },
      error: (e) => {
        this.enregistrement.set(false);
        this.erreur.set(e?.error?.message ?? 'Erreur lors de la mise à jour.');
        this.cdr.markForCheck();
      },
    });
  }

  changerMotDePasse(): void {
    if (!this.ancien || !this.nouveau || !this.confirmation) {
      this.erreurMdp.set('Veuillez remplir tous les champs.');
      return;
    }
    if (this.nouveau.length < 6) {
      this.erreurMdp.set('Le nouveau mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (this.nouveau !== this.confirmation) {
      this.erreurMdp.set('Les deux mots de passe ne correspondent pas.');
      return;
    }

    this.erreurMdp.set('');
    this.messageMdp.set('');
    this.chargementMdp.set(true);

    this.http.post(`${environment.apiUrl}/patient/changer-mot-de-passe`, {
      ancien_mot_de_passe: this.ancien,
      nouveau_mot_de_passe: this.nouveau,
      nouveau_mot_de_passe_confirmation: this.confirmation,
    }).subscribe({
      next: () => {
        this.chargementMdp.set(false);
        this.ancien = '';
        this.nouveau = '';
        this.confirmation = '';
        this.messageMdp.set('Mot de passe modifié.');
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.chargementMdp.set(false);
        this.erreurMdp.set(
          err.error?.errors?.ancien_mot_de_passe?.[0]
          ?? err.error?.message
          ?? 'Erreur lors du changement.'
        );
        this.cdr.markForCheck();
      },
    });
  }

  seDeconnecter(): void {
    this.auth.deconnexion();
    this.router.navigate(['/login']);
  }
}