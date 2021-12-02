import { Component, OnInit } from '@angular/core';
import { emptyQuestion, Question } from 'src/app/app.component';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss']
})
export class RevisionComponent implements OnInit {

  constructor() { }
  questions: Question[] = [];
  current: Question = emptyQuestion();
  index: number = 0;

  ngOnInit(): void {
  }

  // There are questions with answers that we haven't answered
  public questionsLeft() {
    return !!this.questions.filter((q) => q.answer != '' && q.answeredToday == false);
  }

  // All the questions with answers
  public questionsToAnswer() {
    return this.questions.filter((q) => q.answer != '');
  }
  
  public nextQuestion() {
    let randomIndex = 0;

    if (this.questionsLeft()) {
      let answeredThisQuestion = true;
      // Get a random question that we haven't answered
      while (answeredThisQuestion) {
        randomIndex = Math.floor(Math.random()*this.questions.length);
        if (!this.questions[randomIndex].answeredToday && this.questions[randomIndex].answer) {
          answeredThisQuestion = false;
        }
      }
      
      this.index = randomIndex;
    } else {
      this.index = 0;
    }

    this.current = this.questions[this.index];
  }

  public answeredCorrectly() {
    const currentDate = new Date().toISOString();
    console.log('questions: ', this.questions);
    this.questions[this.index].answeredToday = true;
    this.questions[this.index].datesAnswered.push(currentDate);
  }

}
