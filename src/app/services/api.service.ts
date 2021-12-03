import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddQuestion, emptyAddQuestion, Question } from '../model/IQuestion';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getQuestions() {
    return this.http.get('https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/questions.json');
  }

  updateQuestion(question: Question) {
    const questionWithoutID: AddQuestion = emptyAddQuestion();
    questionWithoutID.answer = question.answer;
    questionWithoutID.question = question.question;
    questionWithoutID.answerExpiryDate = question.answerExpiryDate;
    questionWithoutID.timesAnsweredCorrectly = question.timesAnsweredCorrectly;

    return this.http.put(
      `https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/questions/${question.id}.json`,
      JSON.stringify(questionWithoutID),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }

  addQuestion(question: AddQuestion) {
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
