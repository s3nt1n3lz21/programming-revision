import { Component, OnInit } from '@angular/core';
import { Question, emptyQuestion, DAY } from 'src/app/model/IQuestion';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss']
})
export class RevisionComponent implements OnInit {

  constructor(
    private apiService: ApiService
  ) { }

  questions: Question[] = [];
  currentQuestion: Question = emptyQuestion();
  index: number = 0;

  ngOnInit(): void {
    this.apiService.getQuestions().subscribe(
      (data) => {
        const questions = [];
        for (const key in data) {
          const question: Question = {
            id: key,
            ...data[key]
          };

          questions.push(question);
        }
  
        this.questions = questions;
        this.nextQuestion();
      },
      (error) => {
        console.error(error);
      }
    )
  }

  // There are questions with answers that we haven't answered
  public questionsLeft() {
    return this.questions.some((q) => q.answer != '' && new Date(q.answerExpiryDate) < new Date());
  }

  // All the questions with answers
  public questionsToAnswer() {
    return this.questions.filter((q) => q.answer != '');
  }
  
  public nextQuestion() {
    let randomIndex = 0;

    if (this.questionsLeft()) {
      console.log('there are questions left');
      let answeredThisQuestion = true;
      let limit = 0;
      // Get a random question that we haven't answered
      while (answeredThisQuestion && limit < 10000) {
        randomIndex = Math.floor(Math.random()*this.questions.length);
        if (!(new Date(this.questions[randomIndex].answerExpiryDate) < new Date())  && this.questions[randomIndex].answer) {
          answeredThisQuestion = false;
        }
        limit += 1;
      }
      
      console.log('question index: ', randomIndex);
      this.index = randomIndex;
    } else {
      this.index = 0;
    }

    this.currentQuestion = this.questions[this.index];
  }

  public expired(date: string) {
    return new Date(date) < new Date();
  }
}
