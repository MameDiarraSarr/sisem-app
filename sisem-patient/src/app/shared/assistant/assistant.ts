import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { AssistantService, Reponse } from '../../core/services/assistant';

interface Message {
  auteur: 'bot' | 'patient';
  texte: string;
}

@Component({
  selector: 'app-assistant',
  imports: [],
  templateUrl: './assistant.html',
  styleUrl: './assistant.scss',
})
export class Assistant implements AfterViewChecked {

  private assistantService = inject(AssistantService);

  @ViewChild('zoneMessages') zoneMessages?: ElementRef<HTMLDivElement>;

  ouvert = signal(false);
  saisie = signal('');
  enTrainDeParler = signal(false);

  questionsSuggerees = this.assistantService.getQuestionsSuggerees();

  messages = signal<Message[]>([
    { auteur: 'bot', texte: "Bonjour. Je suis votre assistant SISEM. Je peux vous expliquer ce que signifient les analyses de vos résultats. Je ne remplace pas votre médecin." }
  ]);

  private doitDefiler = false;

  ngAfterViewChecked(): void {
    if (this.doitDefiler && this.zoneMessages) {
      const el = this.zoneMessages.nativeElement;
      el.scrollTop = el.scrollHeight;
      this.doitDefiler = false;
    }
  }

  basculerPanneau(): void {
    this.ouvert.update(v => !v);
    if (!this.ouvert()) this.arreterLecture();
  }

  fermer(): void {
    this.ouvert.set(false);
    this.arreterLecture();
  }

  onSaisie(valeur: string): void {
    this.saisie.set(valeur);
  }

  // Le patient clique sur une question suggérée
  poserQuestion(r: Reponse): void {
    this.ajouterMessage('patient', r.question);
    this.repondre(r.texteFr);
  }

  // Le patient tape sa question
  envoyer(): void {
    const texte = this.saisie().trim();
    if (!texte) return;

    this.ajouterMessage('patient', texte);
    this.saisie.set('');

    const reponse = this.assistantService.chercherReponse(texte);
    this.repondre(reponse ? reponse.texteFr : this.assistantService.messageIncompris());
  }

  private repondre(texte: string): void {
    // Petit délai pour que ça paraisse naturel
    setTimeout(() => this.ajouterMessage('bot', texte), 350);
  }

  private ajouterMessage(auteur: 'bot' | 'patient', texte: string): void {
    this.messages.update(m => [...m, { auteur, texte }]);
    this.doitDefiler = true;
  }

  // ═══ Synthèse vocale (le bot parle) ═══
  lire(texte: string): void {
    if (!('speechSynthesis' in window)) {
      alert("La lecture vocale n'est pas disponible sur ce navigateur.");
      return;
    }
    this.arreterLecture();

    const parole = new SpeechSynthesisUtterance(texte);
    parole.lang = 'fr-FR';
    parole.rate = 0.95;   // un peu plus lent, pour être compris
    parole.onstart = () => this.enTrainDeParler.set(true);
    parole.onend = () => this.enTrainDeParler.set(false);
    parole.onerror = () => this.enTrainDeParler.set(false);

    window.speechSynthesis.speak(parole);
  }

  arreterLecture(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.enTrainDeParler.set(false);
    }
  }
}