import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Question, emptyQuestion, DAY } from 'src/app/model/IQuestion';
import { ApiService } from 'src/app/services/api.service';
import { UpdateQuestion } from 'src/app/store/action';
import { AppStateWrapper } from 'src/app/store/reducer';

@Component({
  selector: 'app-revision',
  templateUrl: './revision.component.html',
  styleUrls: ['./revision.component.scss']
})
export class RevisionComponent implements OnInit {

  constructor(
    private store: Store<AppStateWrapper>,
    private apiService: ApiService
  ) { }

  // Component State
  questions: Question[] = [];
  currentQuestion: Question = emptyQuestion();
  index: number = 0;
  showAnswer: boolean = false;

  // App State

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
    this.showAnswer = false;
    let randomIndex = 0;

    if (this.questionsLeft()) {
      let answeredThisQuestion = true;
      let limit = 0;
      // Get a random question that we haven't answered
      while (answeredThisQuestion && limit < 10000) {
        randomIndex = Math.floor(Math.random()*this.questions.length);
        if ((new Date(this.questions[randomIndex].answerExpiryDate) < new Date()) && this.questions[randomIndex].answer) {
          answeredThisQuestion = false;
        }
        limit += 1;
      }
    
      this.index = randomIndex;
    } else {
      this.index = 0;
    }

    this.currentQuestion = this.questions[this.index];
  }

  answeredIncorrectly = () => {
    const updatedQuestion = { ...this.currentQuestion } ;
    updatedQuestion.timesAnsweredCorrectly = 0;
    updatedQuestion.answerExpiryDate = new Date(Date.now() - DAY).toISOString();

    this.apiService.updateQuestion(updatedQuestion).subscribe(
      () => {
        this.store.dispatch(new UpdateQuestion(updatedQuestion));
      },
      (error) => {console.error(error)}
    )
    this.nextQuestion();
  }

  answeredCorrectly = () => {
    console.log('question answered correctly');

    const updatedQuestion = { ...this.currentQuestion } ;
    updatedQuestion.timesAnsweredCorrectly += 1;
    updatedQuestion.answerExpiryDate = new Date(Date.now() + DAY*2**(this.currentQuestion.timesAnsweredCorrectly)).toISOString();
    this.apiService.updateQuestion(updatedQuestion).subscribe(
      () => {
        // Update the list of questions
        console.log('updated question: ', updatedQuestion);
        this.store.dispatch(new UpdateQuestion(updatedQuestion));
      },
      (error) => {console.error(error)}
    )

    this.nextQuestion();
  }

  trackByFn(index, item) {
    return item.id; // or item.id
  }
}
