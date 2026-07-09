import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ResultatService } from '../../../core/services/resultat';
import { Auth } from '../../../core/services/auth';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-detail',
  imports: [RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail {

  private route = inject(ActivatedRoute);
  private resultatService = inject(ResultatService);
  private auth = inject(Auth);

  patient = this.auth.patientConnecte();

  resultat = this.resultatService.getResultat(
    Number(this.route.snapshot.paramMap.get('id'))
  );

  dateEdition = new Date().toLocaleDateString('fr-FR');

  statutValeur(valeur: string, reference: string): 'normal' | 'anormal' | 'qualitatif' {
    const val = parseFloat(valeur.replace(',', '.'));
    if (isNaN(val)) return 'qualitatif';
    const bornes = reference.split('-').map(b => parseFloat(b.trim().replace(',', '.')));
    if (bornes.length !== 2 || bornes.some(isNaN)) return 'qualitatif';
    const [min, max] = bornes;
    return (val >= min && val <= max) ? 'normal' : 'anormal';
  }

  telechargerPdf(): void {
    if (!this.resultat) return;

    const doc = new jsPDF();
    const r = this.resultat;
    const p = this.patient;

    // Couleurs SISEM
    const navy: [number, number, number] = [26, 61, 99];
    const blueMid: [number, number, number] = [74, 127, 167];

    let y = 20;

    // En-tête
    doc.setFillColor(...navy);
    doc.rect(0, 0, 210, 4, 'F');

    doc.setFontSize(18);
    doc.setTextColor(...navy);
    doc.setFont('helvetica', 'bold');
    doc.text('SISEM', 20, y);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Laboratoire - Hopital d\'Enfants Albert Royer', 20, y + 6);
    doc.text('Compte-rendu d\'analyses medicales', 20, y + 11);
    doc.text('Edite le ' + this.dateEdition, 150, y);

    y += 22;
    doc.setDrawColor(...blueMid);
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);

    // Identité patient
    y += 10;
    doc.setFontSize(11);
    doc.setTextColor(...navy);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient : ' + (p?.prenom ?? '') + ' ' + (p?.nom ?? ''), 20, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('N Dossier : ' + r.numeroLabo, 20, y + 6);
    doc.text('Date du resultat : ' + r.dateResultat, 120, y + 6);

    // Titre examen
    y += 16;
    doc.setFillColor(...navy);
    doc.rect(20, y - 5, 170, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(r.examenNom, 24, y + 1);

    // Tableau des analyses
    y += 14;
    doc.setFontSize(9);
    doc.setTextColor(...blueMid);
    doc.setFont('helvetica', 'bold');
    doc.text('PARAMETRE', 22, y);
    doc.text('RESULTAT', 90, y);
    doc.text('UNITE', 125, y);
    doc.text('REFERENCE', 155, y);

    y += 3;
    doc.setDrawColor(200, 210, 220);
    doc.line(20, y, 190, y);

    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    for (const a of r.analyses) {
      const statut = this.statutValeur(a.valeur, a.valeurReference);
      doc.setTextColor(40, 40, 40);
      doc.text(a.nom, 22, y);

      // Valeur en rouge si anormale
      if (statut === 'anormal') {
        doc.setTextColor(192, 57, 43);
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setTextColor(10, 25, 49);
        doc.setFont('helvetica', 'bold');
      }
      doc.text(a.valeur, 90, y);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(120, 120, 120);
      doc.text(a.unite, 125, y);
      doc.text(a.valeurReference, 155, y);

      y += 8;
      doc.setDrawColor(235, 240, 245);
      doc.line(20, y - 3, 190, y - 3);
    }

    // Commentaire
    if (r.commentaire) {
      y += 6;
      doc.setFillColor(246, 250, 253);
      doc.rect(20, y - 5, 170, 16, 'F');
      doc.setTextColor(...blueMid);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('INTERPRETATION DU BIOLOGISTE', 24, y);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(r.commentaire, 24, y + 6);
      y += 16;
    }

    // Pied de page
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

    // Télécharge le fichier
    doc.save('resultat-' + r.examenNom + '-' + r.numeroLabo.replace(/\//g, '-') + '.pdf');
  }
}