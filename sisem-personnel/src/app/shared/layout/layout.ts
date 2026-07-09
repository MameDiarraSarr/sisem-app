import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Auth } from '../../core/services/auth';

// Un lien de menu
interface LienMenu {
  libelle: string;
  route: string;
  icone: string; // le chemin SVG
}

@Component({
  selector: 'app-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

  private auth = inject(Auth);
  private router = inject(Router);

  // L'utilisateur connecté
  utilisateur = this.auth.utilisateurConnecte;

  // Les icônes réutilisables
  private icones = {
    patients: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0 0.01',
    examens: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
    profil: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0 0.01',
  };

  // Le menu s'adapte selon le rôle
  menu = computed<LienMenu[]>(() => {
    const role = this.utilisateur()?.role;

    if (role === 'secretaire') {
      return [
        { libelle: 'Patients', route: '/secretaire', icone: this.icones.patients },
        { libelle: 'Examens', route: '/secretaire/examens', icone: this.icones.examens },
      ];
    }

    if (role === 'technicien') {
      return [
        { libelle: 'Bulletins à traiter', route: '/technicien', icone: this.icones.examens },
      ];
    }

    if (role === 'biologiste') {
      return [
        { libelle: 'À valider', route: '/biologiste', icone: this.icones.examens },
        { libelle: 'Historique', route: '/biologiste/historique', icone: this.icones.patients },
      ];
    }

    if (role === 'medecin') {
      return [
        { libelle: 'Résultats', route: '/medecin', icone: this.icones.examens },
      ];
    }

    if (role === 'major') {
      return [
        { libelle: 'Résultats', route: '/major', icone: this.icones.examens },
        { libelle: 'Liste des médecins', route: '/major/medecins', icone: this.icones.patients },
      ];
    }

    if (role === 'admin') {
      return [
        { libelle: 'Tableau de bord', route: '/admin', icone: this.icones.examens },
        { libelle: 'Personnel', route: '/admin/personnel', icone: this.icones.patients },
        { libelle: 'Affectations', route: '/admin/affectations', icone: this.icones.patients },
      ];
    }

    // par défaut, aucun menu
    return [];
  });

  // Initiales pour l'avatar
  initiales = computed(() => {
    const nom = this.utilisateur()?.nom ?? '';
    const parts = nom.split(' ');
    return parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  });

  // Libellé du rôle en français
  roleLibelle = computed(() => {
    const role = this.utilisateur()?.role;
    const libelles: Record<string, string> = {
      secretaire: 'Secrétaire',
      technicien: 'Technicien',
      biologiste: 'Biologiste',
      major: 'Major',
      medecin: 'Médecin',
      admin: 'Administrateur',
    };
    return role ? libelles[role] : '';
  });

  seDeconnecter(): void {
    this.auth.deconnexion();
    this.router.navigate(['/login']);
  }
}