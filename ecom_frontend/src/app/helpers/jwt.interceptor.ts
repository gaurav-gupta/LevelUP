import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      // add authorization header with jwt token if available
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (currentUser && currentUser.user_auth_token) {
      const t = 'token:' + currentUser.user_auth_token;
      const token = 'Basic ' + btoa(t);
      request = request.clone({
        setHeaders: {
          authorization: token,
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request);
  }
}
