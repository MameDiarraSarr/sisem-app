import { HttpInterceptorFn } from '@angular/common/http';

// Attache le token Bearer à chaque requête sortante vers l'API
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
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

  return next(req);
};