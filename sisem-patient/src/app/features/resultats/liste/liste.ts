import { Component, inject, signal, computed, ChangeDetectorRef, OnInit } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { ResultatService } from '../../../core/services/resultat';
import { ResultatPatient } from '../../../core/models/resultat';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-liste',
  imports: [],
  templateUrl: './liste.html',
  styleUrl: './liste.scss',
})
export class Liste implements OnInit {

  private auth = inject(Auth);
  private resultatService = inject(ResultatService);
  private cdr = inject(ChangeDetectorRef);

  patient = this.auth.patientConnecte();

  sectionRecents = signal(true);
  sectionAnterieurs = signal(false);
  detailOuvertId = signal<number | null>(null);
  recherche = signal('');
  chargement = signal(true);

  private tousSignal = signal<ResultatPatient[]>([]);
  private get tous(): ResultatPatient[] { return this.tousSignal(); }

  ngOnInit(): void {
    this.resultatService.getMesResultats().subscribe({
      next: (resultats) => {
        const tries = resultats.sort(
          (a, b) => this.enDate(b.dateResultat) - this.enDate(a.dateResultat)
        );
        this.tousSignal.set(tries);
        this.chargement.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.chargement.set(false);
        this.cdr.markForCheck();
      },
    });
  }

  private enDate(s: string): number {
    const [j, m, a] = s.split('/').map(Number);
    return new Date(a, m - 1, j).getTime();
  }

  resultatsRecents = computed(() => {
    const tous = this.tousSignal();
    if (tous.length === 0) return [];
    const dateRecente = tous[0].dateResultat;
    return tous.filter(r => r.dateResultat === dateRecente);
  });

  resultatsAnterieurs = computed(() => {
    const tous = this.tousSignal();
    if (tous.length === 0) return [];
    const dateRecente = tous[0].dateResultat;
    const anterieurs = tous.filter(r => r.dateResultat !== dateRecente);

    const terme = this.recherche().toLowerCase().trim();
    if (!terme) return anterieurs;
    return anterieurs.filter(r =>
      r.examenNom.toLowerCase().includes(terme) ||
      r.numeroLabo.toLowerCase().includes(terme) ||
      r.dateResultat.toLowerCase().includes(terme) ||
      (r.medecinPrescripteur ?? '').toLowerCase().includes(terme)
    );
  });

  basculerRecents(): void { this.sectionRecents.update(v => !v); }
  basculerAnterieurs(): void { this.sectionAnterieurs.update(v => !v); }

  basculerDetail(id: number): void {
    this.detailOuvertId.set(this.detailOuvertId() === id ? null : id);
  }

  onRecherche(valeur: string): void {
    this.recherche.set(valeur);
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
    const normaliser = (s: string) =>
      s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (valeur && reference) {
      return normaliser(valeur) === normaliser(reference) ? 'normal' : 'anormal';
    }

    return 'qualitatif';
  }

  telechargerPdf(id: number): void {
    const r = this.tous.find(x => x.id === id);
    if (!r) return;
    const p = this.patient;

    const doc = new jsPDF();
    const navy: [number, number, number] = [26, 61, 99];
    const blueMid: [number, number, number] = [74, 127, 167];
    let y = 20;

    doc.setFillColor(...navy);
    doc.rect(0, 0, 210, 4, 'F');
    doc.setFontSize(18); doc.setTextColor(...navy); doc.setFont('helvetica', 'bold');
    doc.text('SISEM', 20, y);
    doc.setFontSize(10); doc.setTextColor(100, 100, 100); doc.setFont('helvetica', 'normal');
    doc.text('Laboratoire - Hopital d\'Enfants Albert Royer', 20, y + 6);
    doc.text('Compte-rendu d\'analyses medicales', 20, y + 11);
    doc.text('Edite le ' + new Date().toLocaleDateString('fr-FR'), 150, y);

    y += 22; doc.setDrawColor(...blueMid); doc.setLineWidth(0.5); doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(11); doc.setTextColor(...navy); doc.setFont('helvetica', 'bold');
    doc.text('Patient : ' + (p?.prenom ?? '') + ' ' + (p?.nom ?? ''), 20, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(60, 60, 60);
    doc.text('N Dossier : ' + r.numeroLabo, 20, y + 6);
    doc.text('Date du resultat : ' + r.dateResultat, 120, y + 6);
    if (r.medecinPrescripteur) {
      doc.text('Prescripteur : ' + r.medecinPrescripteur, 20, y + 12);
      y += 6;
    }

    y += 16; doc.setFillColor(...navy); doc.rect(20, y - 5, 170, 9, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
    doc.text(r.examenNom, 24, y + 1);

    y += 14; doc.setFontSize(9); doc.setTextColor(...blueMid); doc.setFont('helvetica', 'bold');
    doc.text('PARAMETRE', 22, y); doc.text('RESULTAT', 82, y); doc.text('UNITE', 112, y); doc.text('REFERENCE', 138, y); doc.text('ETAT', 172, y);
    y += 3; doc.setDrawColor(200, 210, 220); doc.line(20, y, 190, y);
    y += 7; doc.setFont('helvetica', 'normal'); doc.setFontSize(10);

    for (const a of r.analyses) {
      const statut = this.statutValeur(a.valeur, a.valeurReference);

      doc.setTextColor(40, 40, 40); doc.setFont('helvetica', 'normal');
      doc.text(a.nom, 22, y);

      doc.setFont('helvetica', 'bold');
      if (statut === 'anormal') { doc.setTextColor(192, 57, 43); } else { doc.setTextColor(10, 25, 49); }
      doc.text(a.valeur, 82, y);

      doc.setFont('helvetica', 'normal'); doc.setTextColor(120, 120, 120);
      doc.text(a.unite, 112, y); doc.text(a.valeurReference, 138, y);

      if (statut === 'anormal') { doc.setTextColor(192, 57, 43); doc.text('Hors norme', 172, y); }
      else if (statut === 'normal') { doc.setTextColor(39, 130, 80); doc.text('Normal', 172, y); }
      else { doc.setTextColor(150, 150, 150); doc.text('—', 172, y); }

      y += 8;
    }

    if (r.commentaire) {
      y += 6; doc.setFillColor(246, 250, 253); doc.rect(20, y - 5, 170, 16, 'F');
      doc.setTextColor(...blueMid); doc.setFontSize(9); doc.setFont('helvetica', 'bold');
      doc.text('INTERPRETATION DU BIOLOGISTE', 24, y);
      doc.setTextColor(50, 50, 50); doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      doc.text(r.commentaire, 24, y + 6); y += 16;
    }

    y += 12; doc.setDrawColor(220, 225, 230); doc.line(20, y, 190, y);
    y += 6; doc.setFontSize(9); doc.setTextColor(120, 120, 120);
    doc.text('Compte-rendu valide par le biologiste responsable.', 20, y);
    doc.setFontSize(8); doc.setTextColor(150, 150, 150);
    doc.text('Document genere par SISEM - Ne pas se substituer a l\'avis de votre medecin.', 20, y + 5);

    doc.save('resultat-' + r.examenNom + '-' + r.numeroLabo.replace(/\//g, '-') + '.pdf');
  }
}