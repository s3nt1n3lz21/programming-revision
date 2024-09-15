import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BaseURLInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const baseUrl = document.getElementsByTagName('base')[0].href.slice(0, -1);
    const newReq = req.clone({ url: `${baseUrl}${req.url}` });
    return next.handle(newReq);
  }
}