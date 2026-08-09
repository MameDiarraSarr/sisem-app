import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Layout } from './shared/layout/layout';
import { Dashboard } from './features/secretaire/dashboard/dashboard';
import { NouveauPatient } from './features/secretaire/nouveau-patient/nouveau-patient';
import { Dashboard as TechnicienDashboard } from './features/technicien/dashboard/dashboard';
import { SaisieResultats } from './features/technicien/saisie-resultats/saisie-resultats';
import { Dashboard as BiologisteDashboard } from './features/biologiste/dashboard/dashboard';
import { DetailResultats } from './features/biologiste/detail-resultats/detail-resultats';
import { Historique } from './features/biologiste/historique/historique';
import { Dashboard as MedecinDashboard } from './features/medecin/dashboard/dashboard';
import { DetailConsultation } from './features/medecin/detail-consultation/detail-consultation';
import { Dashboard as AdminDashboard } from './features/admin/dashboard/dashboard';
import { NouveauCompte } from './features/admin/nouveau-compte/nouveau-compte';
import { authGuard } from './core/guards/auth-guard';
import { Personnel } from './features/admin/personnel/personnel';
import { Affectations } from './features/admin/affectations/affectations';
import { ModifierCompte } from './features/admin/modifier-compte/modifier-compte';
import { Examens } from './features/secretaire/examens/examens';
import { NouveauBulletin } from './features/secretaire/nouveau-bulletin/nouveau-bulletin';
import { Dashboard as MajorDashboard } from './features/major/dashboard/dashboard';
import { Medecins as MajorMedecins } from './features/major/medecins/medecins';
import { DetailConsultation as MajorDetailConsultation } from './features/major/detail-consultation/detail-consultation';
import { Profil } from './features/profil/profil';
import { DetailPatient } from './features/secretaire/detail-patient/detail-patient'; 
import { Resultat } from './features/secretaire/resultat/resultat';
import { ModifierPatient } from './features/secretaire/modifier-patient/modifier-patient';
import { ChangerMotDePasse } from './features/changer-mot-de-passe/changer-mot-de-passe';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'changer-mot-de-passe', component: ChangerMotDePasse, canActivate: [authGuard] },

  {
    path: 'secretaire',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },
      { path: 'nouveau-patient', component: NouveauPatient },
      { path: 'examens', component: Examens },
      { path: 'nouveau-bulletin/:patientId', component: NouveauBulletin },
      { path: 'profil', component: Profil },
      { path: 'patient/:id', component: DetailPatient },
      { path: 'resultat/:id', component: Resultat },
      { path: 'patient/:id/modifier', component: ModifierPatient },
    ]
  },

  {
    path: 'technicien',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', component: TechnicienDashboard },
      { path: 'saisie/:id', component: SaisieResultats },
      { path: 'profil', component: Profil },
    ]
  },

  {
    path: 'biologiste',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', component: BiologisteDashboard },
      { path: 'detail/:id', component: DetailResultats },
      { path: 'historique', component: Historique },
      { path: 'profil', component: Profil },
    ]
  },

  {
    path: 'medecin',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', component: MedecinDashboard },
      { path: 'consultation/:id', component: DetailConsultation },
      { path: 'profil', component: Profil },
    ]
  },

  {
    path: 'admin',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', component: AdminDashboard },
      { path: 'personnel', component: Personnel },
      { path: 'nouveau-compte', component: NouveauCompte },
      { path: 'affectations', component: Affectations },
      { path: 'modifier-compte/:id', component: ModifierCompte },
      { path: 'profil', component: Profil },
    ]
  },

  {
    path: 'major',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: '', component: MajorDashboard },
      { path: 'medecins', component: MajorMedecins },
      { path: 'consultation/:id', component: MajorDetailConsultation },
      { path: 'profil', component: Profil },
    ]
  },
];