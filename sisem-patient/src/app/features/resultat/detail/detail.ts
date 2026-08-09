import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ResultatService } from '../../../core/services/resultat';
import { Auth } from '../../../core/services/auth';
import { ResultatPatient } from '../../../core/models/resultat';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-detail',
  imports: [RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail implements OnInit {

  private route = inject(ActivatedRoute);
  private resultatService = inject(ResultatService);
  private auth = inject(Auth);
  private cdr = inject(ChangeDetectorRef);

  patient = this.auth.patientConnecte();

  resultat = signal<ResultatPatient | undefined>(undefined);
  chargement = signal(true);

  dateEdition = new Date().toLocaleDateString('fr-FR');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.resultatService.getResultat(id).subscribe({
      next: (r) => {
        this.resultat.set(r);
        this.chargement.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.chargement.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  statutValeur(valeur: string, reference: string): 'normal' | 'anormal' | 'qualitatif' {
    const val = parseFloat(valeur.replace(',', '.'));
    const bornes = reference.split('-').map(b => parseFloat(b.trim().replace(',', '.')));

    // Cas numérique : référence du type "135 - 145"
    if (!isNaN(val) && bornes.length === 2 && !bornes.some(isNaN)) {
      const [min, max] = bornes;
      return (val >= min && val <= max) ? 'normal' : 'anormal';
    }

    // Cas qualitatif : référence texte (ex. "Négatif")
    // On compare le résultat saisi à la valeur attendue, sans tenir compte de la casse ni des accents
    const normaliser = (s: string) =>
      s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (valeur && reference) {
      return normaliser(valeur) === normaliser(reference) ? 'normal' : 'anormal';
    }

    return 'qualitatif';
  }

  telechargerPdf(): void {
    const r = this.resultat();
    if (!r) return;

    const p = this.patient;

    const doc = new jsPDF();
    const navy: [number, number, number] = [26, 61, 99];
    const blueMid: [number, number, number] = [74, 127, 167];

    let y = 20;

    doc.setFillColor(...navy);
    doc.rect(0, 0, 210, 4, 'F');

    doc.setFontSize(16);
    doc.setTextColor(...navy);
    doc.setFont('helvetica', 'bold');
    doc.text('Hôpital d\'Enfants Albert Royer', 20, y);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Système de Suivi des Examens Médicaux', 20, y + 6);
    doc.text('Édité le ' + this.dateEdition, 150, y);

    y += 22;
    doc.setDrawColor(...blueMid);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);

    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(...navy);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient : ' + (p?.prenom ?? '') + ' ' + (p?.nom ?? ''), 20, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('N Dossier : ' + r.numeroLabo, 20, y + 6);
    doc.text('Date du rséultat : ' + r.dateResultat, 120, y + 6);

    y += 16;
    doc.setFillColor(...navy);
    doc.rect(20, y - 5, 170, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(r.examenNom, 24, y + 1);

    y += 14;
    doc.setFontSize(9);
    doc.setTextColor(...blueMid);
    doc.setFont('helvetica', 'bold');
    doc.text('PARAMETRE', 22, y);
    doc.text('RESULTAT', 82, y);
    doc.text('UNITE', 112, y);
    doc.text('REFERENCE', 138, y);
    doc.text('ETAT', 172, y);

    y += 3;
    doc.setDrawColor(200, 210, 220);
    doc.line(20, y, 190, y);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    for (const a of r.analyses) {
      const statut = this.statutValeur(a.valeur, a.valeurReference);

      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'normal');
      doc.text(a.nom, 22, y);

      // Valeur : rouge si hors norme, sinon bleu foncé
      doc.setFont('helvetica', 'bold');
      if (statut === 'anormal') { doc.setTextColor(192, 57, 43); }
      else { doc.setTextColor(10, 25, 49); }
      doc.text(a.valeur, 82, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(a.unite, 112, y);
      doc.text(a.valeurReference, 138, y);

      // Colonne état
      if (statut === 'anormal') { doc.setTextColor(192, 57, 43); doc.text('Hors norme', 172, y); }
      else if (statut === 'normal') { doc.setTextColor(39, 130, 80); doc.text('Normal', 172, y); }
      else { doc.setTextColor(150, 150, 150); doc.text('—', 172, y); }

      y += 8;
    }

    if (r.commentaire) {
      y += 6;
      doc.setFillColor(246, 250, 253);
      doc.rect(20, y - 5, 170, 16, 'F');
      doc.setTextColor(...blueMid);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('INTERPRÉTATION DU BIOLOGISTE', 24, y);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(r.commentaire, 24, y + 6);
      y += 16;
    }

    y += 12;
    doc.setDrawColor(220, 225, 230);
    doc.line(20, y, 190, y);
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text('Compte-rendu valide par le biologiste responsable.', 20, y);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Document genere par SISEM - Ne pas se substituer a l\'avis de votre medecin.', 20, y + 5);

    doc.save('resultat-' + r.examenNom + '-' + r.numeroLabo.replace(/\//g, '-') + '.pdf');
  }
}