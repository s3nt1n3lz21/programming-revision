import { Injectable } from '@angular/core';
import { IAppState } from '../model/IAppState';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // Used to persist the app state after refreshing the page

  // The app state is saved independently for each tab/session e.g. sessionStorage
  // The app state is also saved to localStorage so that your last saved state is loaded up when opening a new tab

  constructor() { }

  setItem(key: IAppState, value: string) {
    sessionStorage.setItem(key, value);
    localStorage.setItem(key, value);
  }

  getItem(key: IAppState): string | null {
    const sessionValue = sessionStorage.getItem(key);
    if (sessionValue) {
      return sessionValue;
    } else {
      return localStorage.getItem(key);
    }
  }
}