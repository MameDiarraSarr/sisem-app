import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Layout } from './shared/layout/layout';
import { Liste } from './features/resultats/liste/liste';
import { Detail } from './features/resultat/detail/detail';
import { Profil } from './features/profil/profil/profil';
import { authGuard } from './core/guards/auth-guard-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },

  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'accueil', component: Liste },
      { path: 'resultat/:id', component: Detail },
      { path: 'profil', component: Profil },
    ]
  },
];