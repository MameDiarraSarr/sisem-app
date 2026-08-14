import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Layout } from './shared/layout/layout';
import { Liste } from './features/resultats/liste/liste';
import { Profil } from './features/profil/profil/profil';
import { ChangerMotDePasse } from './features/changer-mot-de-passe/changer-mot-de-passe';
import { authGuard } from './core/guards/auth-guard-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'changer-mot-de-passe', component: ChangerMotDePasse, canActivate: [authGuard] },

  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'accueil', component: Liste },
      { path: 'profil', component: Profil },
    ]
  },
];