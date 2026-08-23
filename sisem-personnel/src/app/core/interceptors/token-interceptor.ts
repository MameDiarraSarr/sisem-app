import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../services/auth';

// Attache le token Bearer à chaque requête et gère l'expiration de session
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(Auth);
  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
  } else {
    req = req.clone({ setHeaders: { Accept: 'application/json' } });
  }

  return next(req).pipe(
    catchError((err) => {
      // Token expiré ou invalide : on nettoie la session et on renvoie à la connexion
      if (err.status === 401) {
        auth.nettoyer();
        router.navigate(['/login']);
      }
      return throwError(() => err);
    })
  );
};