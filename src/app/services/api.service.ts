import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getQuestions() {
    return this.http.get('https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/questions.json');
  }

}
