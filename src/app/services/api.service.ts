import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from '../model/IQuestion';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getQuestions() {
    return this.http.get('https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/questions.json');
  }

  updateQuestion(question: Question) {
    this.http.put(
      'https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/questions.json/' + question.id,
      JSON.stringify(question),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  addQuestion(question: Question) {
    return this.http.post(
      'https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/questions.json',
      JSON.stringify(question),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

}
