import { Injectable } from '@angular/core';

export interface Reponse {
  id: string;
  question: string;
  motsCles: string[];
  texteFr: string;
  audioWolof?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssistantService {

  // ⚠️ Réponses prédéfinies et validées — l'assistant EXPLIQUE, il ne diagnostique jamais.
  private reponses: Reponse[] = [
    {
      id: 'hemoglobine',
      question: "Qu'est-ce que l'hémoglobine ?",
      motsCles: ['hemoglobine', 'hémoglobine', 'hb'],
      texteFr: "L'hémoglobine est une protéine contenue dans les globules rouges. Elle transporte l'oxygène des poumons vers tout le corps. C'est pour cela qu'on la mesure lorsqu'on cherche à savoir si vous manquez de fer ou si vous êtes anémié.",
    },
    {
      id: 'globules-blancs',
      question: "À quoi servent les globules blancs ?",
      motsCles: ['globules blancs', 'leucocytes', 'blancs'],
      texteFr: "Les globules blancs sont les défenseurs de votre corps. Ils combattent les microbes, les virus et les infections. Leur nombre peut varier quand votre organisme lutte contre une maladie.",
    },
    {
      id: 'plaquettes',
      question: "Que sont les plaquettes ?",
      motsCles: ['plaquettes', 'plaquette'],
      texteFr: "Les plaquettes sont de très petites cellules du sang. Elles servent à arrêter les saignements en formant un caillot lorsqu'on se blesse.",
    },
    {
      id: 'glycemie',
      question: "Que signifie la glycémie ?",
      motsCles: ['glycemie', 'glycémie', 'glucose', 'sucre'],
      texteFr: "La glycémie, c'est la quantité de sucre présente dans votre sang. On la mesure souvent à jeun. Elle permet notamment de surveiller le diabète.",
    },
    {
      id: 'creatinine',
      question: "Qu'est-ce que la créatinine ?",
      motsCles: ['creatinine', 'créatinine', 'rein', 'reins'],
      texteFr: "La créatinine est un déchet produit par les muscles, que les reins éliminent dans les urines. La mesurer permet de vérifier que vos reins fonctionnent bien.",
    },
    {
      id: 'hors-norme',
      question: "Que veut dire « Hors norme » ?",
      motsCles: ['hors norme', 'anormal', 'rouge', 'norme'],
      texteFr: "« Hors norme » signifie simplement que la valeur mesurée se situe en dehors de l'intervalle habituel. Cela ne veut pas dire que vous êtes malade. Seul votre médecin peut interpréter ce résultat en tenant compte de votre situation.",
    },
    {
      id: 'reference',
      question: "C'est quoi les valeurs de référence ?",
      motsCles: ['reference', 'référence', 'intervalle', 'valeurs normales'],
      texteFr: "Les valeurs de référence sont l'intervalle dans lequel se situent la plupart des personnes en bonne santé. Elles servent de repère au médecin pour analyser votre résultat.",
    },
    {
      id: 'grave',
      question: "Mon résultat est-il grave ?",
      motsCles: ['grave', 'inquiet', 'malade', 'peur', 'inquietant', 'inquiétant'],
      texteFr: "Je ne peux pas interpréter vos résultats : je peux seulement vous expliquer ce que signifient les mots. Seul votre médecin, qui connaît votre situation, peut vous dire ce que vos résultats signifient pour vous. Prenez rendez-vous avec lui pour en discuter.",
    },
    {
      id: 'telecharger',
      question: "Comment télécharger mes résultats ?",
      motsCles: ['telecharger', 'télécharger', 'pdf', 'imprimer', 'garder'],
      texteFr: "Ouvrez le résultat qui vous intéresse, puis cliquez sur le bouton « Télécharger le PDF » situé en bas. Le document sera enregistré sur votre appareil. Vous pourrez ensuite le montrer ou l'envoyer à votre médecin.",
    },
    {
      id: 'delai',
      question: "Quand mes résultats seront-ils disponibles ?",
      motsCles: ['quand', 'delai', 'délai', 'attendre', 'disponible', 'pret', 'prêt'],
      texteFr: "Vos résultats apparaissent ici dès que le biologiste les a validés. Vous recevrez une notification. Le délai dépend du type d'examen : certains sont prêts en quelques heures, d'autres demandent plusieurs jours.",
    },
  ];

  getQuestionsSuggerees(): Reponse[] {
    return this.reponses;
  }

  chercherReponse(texte: string): Reponse | null {
    const t = texte.toLowerCase().trim();
    if (!t) return null;

    let meilleure: Reponse | null = null;
    let longueurMax = 0;

    for (const r of this.reponses) {
      for (const mot of r.motsCles) {
        if (t.includes(mot) && mot.length > longueurMax) {
          meilleure = r;
          longueurMax = mot.length;
        }
      }
    }
    return meilleure;
  }

  messageIncompris(): string {
    return "Je n'ai pas compris votre question. Je peux vous expliquer ce que signifient les analyses de vos résultats. Essayez de choisir une question ci-dessous, ou reformulez avec un mot comme « hémoglobine », « glycémie » ou « hors norme ».";
  }
}