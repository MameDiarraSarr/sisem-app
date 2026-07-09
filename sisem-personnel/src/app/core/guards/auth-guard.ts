import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Si l'utilisateur est connecté, on l'autorise à voir la page
  if (auth.estConnecte()) {
    return true;
  }

  // Sinon, on le renvoie vers la page de connexion
  router.navigate(['/login']);
  return false;
};