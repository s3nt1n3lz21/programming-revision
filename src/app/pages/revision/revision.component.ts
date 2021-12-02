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
          questions.push(data[key]);
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
    return this.questions.some((q) => q.answer != '' && q.answerExpiryDate < new Date().toISOString());
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
      // Get a random question that we haven't answered
      while (answeredThisQuestion) {
        randomIndex = Math.floor(Math.random()*this.questions.length);
        if (!(this.questions[randomIndex].answerExpiryDate < new Date().toISOString())  && this.questions[randomIndex].answer) {
          answeredThisQuestion = false;
        }
      }
      
      console.log('question index: ', randomIndex);
      this.index = randomIndex;
    } else {
      this.index = 0;
    }

    this.currentQuestion = this.questions[this.index];
  }

  public answeredCorrectly() {
    console.log('questions: ', this.questions);
    this.questions[this.index].answerExpiryDate = new Date().toISOString() + this.questions[this.index].timesAnsweredCorrectly*DAY;
    this.questions[this.index].timesAnsweredCorrectly += 1;
  }

}
