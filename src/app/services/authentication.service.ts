import { Injectable } from '@angular/core';
import { Auth, signInAnonymously } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  isLoggedIn = false;

  constructor(private auth:Auth) { }

  signIn = () => {
    this.auth

    signInAnonymously(this.auth).then(credential=>{
      console.log('signInAnonymously',credential);
      this.userData.addNewUser();
      console.log('add new user')
    });
  }
}
