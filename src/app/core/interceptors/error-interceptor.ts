import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, Observable, retry, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';
      if (error.error instanceof ErrorEvent) {
          errorMessage = `Client-side error: ${error.error.message}`;
      }else {
        switch (error.status) {
          case HttpStatusCode.BadRequest:
            errorMessage = 'Bad Request. Please check your input.';
            break;
          case HttpStatusCode.Unauthorized:
            errorMessage = 'Unauthorized. Please log in again.';
            break;
          case HttpStatusCode.Forbidden:
            errorMessage = 'Forbidden. You do not have permission to perform this action.';
            break;
          case HttpStatusCode.NotFound:
            errorMessage = 'Not Found. The requested resource could not be found.';
            break;
          case HttpStatusCode.InternalServerError:
            errorMessage = 'Server Error. Please try again later.';
            console.log("bgfnfgn")
            break;
          default:
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
      }
      messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: errorMessage 
      });
      return throwError(() => error);
    })
  );
};
