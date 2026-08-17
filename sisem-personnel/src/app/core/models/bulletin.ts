export interface AnalyseResultat {
  analyse_reference_id: number;
  nom_analyse: string;
  valeur_normale: string;
  unite: string;
  valeur_resultat: string | null;
}

export interface BulletinExamenLigne {
  examen_demande_id: number;
  examen_id: number;
  nom_examen: string;
  analyses?: AnalyseResultat[];   // présent seulement dans le détail (show)
}

export interface Bulletin {
  id: number;
  numero_labo: string;
  patient: {
    id: number;
    nom_complet: string;
    numero_dossier: string | null;
    type_patient: 'interne' | 'externe';
    sexe: string | null;
    age: string | null;
    adresse: string | null;
  };
  pavillon: string | null;
  medecin: {
    id: number;
    nom_complet: string;
  } | null;
  indication_examen: string;
  traitement_en_cours: string | null;
  date_enregistrement: string;
  statut: 'enregistre' | 'saisi' | 'valide';
  examens: BulletinExamenLigne[];
  imprime_le: string | null;
  nombre_impressions: number;
}