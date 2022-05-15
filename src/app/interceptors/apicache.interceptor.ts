import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { finalize, share, tap } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';

@Injectable()
export class APICacheInterceptor implements HttpInterceptor {

  constructor(private readonly _cacheService: CacheService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Only cache GET requests
    if (request.method != 'GET') {
      return next.handle(request);
    }
    
    // Clear the cache if cache expired
    const cacheExpired = this._cacheService.cacheExpired();
    if (cacheExpired) {
      this._cacheService.clear();
      this._cacheService.resetExpiryDate();
      return this._getAndCache(request, next);
    } else {
      const responseFromCache = this._cacheService.get(request.urlWithParams);
      const observableResponseFromCache = this._cacheService.getObservable(request.urlWithParams);
      
      // Get the value from the cache
      if (responseFromCache) {
        return of(responseFromCache);
      
      // Subscribe to the observable for the first request if still waiting for a response
      } else if (observableResponseFromCache) {
        return observableResponseFromCache;

      // Make a new request and cache it
      } else {
        return this._getAndCache(request, next);
      }
    }
  }

  // Get the response and store it in the cache, store an observable of the response in the observable cache straight away
  private _getAndCache(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    const observableResponse = next.handle(request).pipe(
      tap(httpEvent => {
        // Don't store error responses and other responses
        if (httpEvent instanceof HttpResponse) {
          this._cacheService.set(request.urlWithParams, httpEvent);
        }
      }),
      share(),
      // When finished retrieving the response, remove the observable from the observable cache
      finalize(() => this._cacheService.deleteObservable(request.urlWithParams))
    )
    this._cacheService.setObservable(request.urlWithParams, observableResponse);
    return observableResponse;
  }
}

// Reference
// https://blog.danieleghidoli.it/2020/10/28/angular-how-to-prevent-duplicated-http-requests/