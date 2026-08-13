import { Component, inject, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ResultatService } from '../../../core/services/resultat';
import { Auth } from '../../../core/services/auth';
import { ResultatPatient } from '../../../core/models/resultat';
import jsPDF from 'jspdf';
import { enregistrerPolice } from '../../../core/police-pdf';
import { logoBase64 } from '../../../core/logo-base64';

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

    if (!isNaN(val) && bornes.length === 2 && !bornes.some(isNaN)) {
      const [min, max] = bornes;
      return (val >= min && val <= max) ? 'normal' : 'anormal';
    }

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
    enregistrerPolice(doc);
    const navy: [number, number, number] = [26, 61, 99];
    const blueMid: [number, number, number] = [74, 127, 167];

    let y = 20;

    // Logo HER en haut à gauche
    doc.addImage(logoBase64, 'PNG', 20, y - 5, 20, 20);

    doc.setFontSize(13); doc.setTextColor(...navy); doc.setFont('Roboto', 'bold');
    doc.text('Système de Suivi des Examens Médicaux (SISEM)', 45, y);
    doc.setFontSize(9); doc.setTextColor(100, 100, 100); doc.setFont('Roboto', 'normal');
    doc.text('LABORATOIRE — HÔPITAL D\'ENFANTS ALBERT ROYER', 45, y + 5);
    doc.text('Tel: 33-859-47-47', 45, y + 10);
    doc.text('Édité le ' + this.dateEdition, 150, y - 2);

    y += 24;
    doc.setDrawColor(...blueMid); doc.setLineWidth(0.5); doc.line(20, y, 190, y);

    y += 10;
    doc.setFontSize(11); doc.setTextColor(...navy); doc.setFont('Roboto', 'bold');
    doc.text('Patient : ' + (p?.prenom ?? '') + ' ' + (p?.nom ?? ''), 20, y);
    doc.setFont('Roboto', 'normal'); doc.setTextColor(60, 60, 60);
    doc.text('N Dossier : ' + r.numeroLabo, 20, y + 6);
    doc.text('Date du résultat : ' + r.dateResultat, 120, y + 6);
    if (r.medecinPrescripteur) {
      doc.text('Prescripteur : ' + r.medecinPrescripteur, 20, y + 12);
      y += 6;
    }
    y += 16;

    // Une SECTION par examen
    for (const examen of r.examens) {
      if (y > 250) { doc.addPage(); y = 20; }

      // Dégradé du bandeau titre : du bleu foncé (26,61,99) au bleu moyen (74,127,167)
      const bandes = 60, largeurBande = 170 / bandes;
      for (let i = 0; i < bandes; i++) {
        const t = i / (bandes - 1);
        const rr = Math.round(26 + (74 - 26) * t);
        const gg = Math.round(61 + (127 - 61) * t);
        const bb = Math.round(99 + (167 - 99) * t);
        doc.setFillColor(rr, gg, bb);
        doc.rect(20 + i * largeurBande, y - 5, largeurBande + 0.5, 9, 'F');
      }
      doc.setTextColor(255, 255, 255); doc.setFont('Roboto', 'bold'); doc.setFontSize(11);
      doc.text(examen.examenNom, 24, y + 1);

      y += 13;
      y += 3; doc.setFont('Roboto', 'normal'); doc.setFontSize(10);

      for (const a of examen.analyses) {
        if (y > 275) { doc.addPage(); y = 20; }
        const anormal = this.statutValeur(a.valeur, a.valeurReference) === 'anormal';

        doc.setTextColor(40, 40, 40); doc.setFont('Roboto', 'normal');
        doc.text(a.nom, 22, y);

        // Valeur : gras seulement si hors norme
        doc.setFont('Roboto', anormal ? 'bold' : 'normal');
        doc.setTextColor(10, 25, 49);
        doc.text(a.valeur, 82, y);

        doc.setFont('Roboto', 'normal'); doc.setTextColor(120, 120, 120);
        doc.text(a.unite, 112, y); doc.text('(' + a.valeurReference + ')', 138, y);

        y += 8;
      }
      y += 10;
    }

    if (r.commentaire) {
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFillColor(246, 250, 253); doc.rect(20, y - 5, 170, 16, 'F');
      doc.setTextColor(...blueMid); doc.setFontSize(9); doc.setFont('Roboto', 'bold');
      doc.text('INTERPRÉTATION DU BIOLOGISTE', 24, y);
      doc.setTextColor(50, 50, 50); doc.setFont('Roboto', 'normal'); doc.setFontSize(10);
      doc.text(r.commentaire, 24, y + 6); y += 16;
    }

    y += 12; doc.setDrawColor(220, 225, 230); doc.line(20, y, 190, y);
    y += 7; doc.setFontSize(9); doc.setTextColor(90, 106, 121);
    doc.text('Compte-rendu validé par le biologiste responsable.', 20, y);
    doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    doc.text('Document généré par SISEM - Ne pas se substituer à l\'avis de votre médecin.', 20, y + 5);

    doc.save('resultat-' + r.numeroLabo.replace(/\//g, '-') + '.pdf');
  }
}