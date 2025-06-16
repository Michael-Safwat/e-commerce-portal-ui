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

    const re = /login/gi;
    const rs = /register/gi;
    const localToken = localStorage.getItem('token');
    if (request.url.search(re) === -1 && request.url.search(rs) === -1) {
      request = request.clone({headers: request.headers.set('Authorization', 'Bearer ' + localToken)});
    }
    return next.handle(request);
  }
}
