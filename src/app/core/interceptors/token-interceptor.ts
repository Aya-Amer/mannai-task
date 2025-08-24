import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'reqres-free-v1'
  };
  const req = request.clone({
    setHeaders: headers,
  });
  return next(req);
};
