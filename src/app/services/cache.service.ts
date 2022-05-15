import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  private _cache: Map<string, HttpEvent<any>> = new Map();
  
  // A cache to store the observables of the responses
  // If we get a second indentical request before we get the response from the first, then subscribe to the observable for the first request
  private _observableCache: Map<string, Observable<HttpEvent<any>>> = new Map();

  private EXPIRE_AFTER: number = 3600000; // 1 hour in ms
  private _expiryDate: Date = new Date();

  constructor() { }

  public cacheExpired(): boolean {
    return this._expiryDate < new Date();
  }

  public clear() {
    this._cache.clear();
  }

  public resetExpiryDate() {
    this._expiryDate = new Date(Date.now() + this.EXPIRE_AFTER);
  }

  public get(requestURLWithParams: string) {
    return this._cache.get(requestURLWithParams);
  }

  public getObservable(requestURLWithParams: string) {
    return this._observableCache.get(requestURLWithParams);
  }

  public set(requestURLWithParams: string, response: HttpResponse<any>) {
    this._cache.set(requestURLWithParams, response);
  }

  public deleteObservable(requestURLWithParams: string) {
    this._observableCache.delete(requestURLWithParams);
  }

  public setObservable(requestURLWithParams: string, response: Observable<HttpEvent<any>>) {
    this._observableCache.set(requestURLWithParams, response);
  }
}