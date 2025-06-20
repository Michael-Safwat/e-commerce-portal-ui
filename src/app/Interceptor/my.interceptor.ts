import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class MyInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const publicEndpoints = [
      '/api/v1/login',
      '/api/v1/users/register'
    ];

    const isPublicEndpoint = publicEndpoints.some(url => request.url.includes(url));
    const localToken = localStorage.getItem('token');

    if (!isPublicEndpoint && localToken) {
      request = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + localToken)
      });
    }

    return next.handle(request);
  }
}
