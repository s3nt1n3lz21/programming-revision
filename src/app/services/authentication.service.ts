import { Injectable } from '@angular/core';
import { Auth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLoggedIn = false;

  constructor(private auth:Auth) { }

  signIn = () => {
    this.auth
  }
}
