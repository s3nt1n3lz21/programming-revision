import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

// Based on Angular documentation on http interceptors:
// https://angular.io/guide/http#http-interceptor-use-cases

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private auth: OktaAuth) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the Okta Auth service.
    const authToken = this.auth.getAccessToken();
    if (!authToken) {
      // no token so no point overriding authorization header
      return next.handle(req);
    }

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
