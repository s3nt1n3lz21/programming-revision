import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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

  // Component State
  currentQuestion: Question = emptyQuestion();
  index: number = 0;
  showCurrentAnswer: boolean = false;

  // App State
  questionsStore: Observable<Question[]>;
  questions: Question[];

  constructor(
    private store: Store<AppStateWrapper>,
    private apiService: ApiService
  ) { 
    this.questionsStore = this.store.select(state => state.state.questions);
  }

  ngOnInit(): void {
    this.questionsStore.subscribe(
      (questions) => {
        this.questions = questions;
        this.nextQuestion();
      },
      (error) => { console.error(error) }
    )
  }

  // There are questions with answers that we haven't answered
  public questionsLeft() {
    return this.questions.some((q) => q.answer != '' && new Date(q.answerExpiryDate) < new Date());
  }

  public selectQuestion = (question: Question) => {
    if (new Date(question.answerExpiryDate) < new Date()) {
      this.showCurrentAnswer = false;
      this.index = this.questions.findIndex(q => q.id === question.id);
      this.currentQuestion = question;
    }
  }
  
  public nextQuestion() {
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

    this.showCurrentAnswer = false;
    this.currentQuestion = this.questions[this.index];
  }

  answeredIncorrectly = () => {
    const updatedQuestion: Question = { ...this.currentQuestion } ;
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
    const updatedQuestion = { ...this.currentQuestion } ;
    updatedQuestion.timesAnsweredCorrectly += 1;
    updatedQuestion.answerExpiryDate = new Date(Date.now() + DAY*2**(this.currentQuestion.timesAnsweredCorrectly)).toISOString();
    this.apiService.updateQuestion(updatedQuestion).subscribe(
      () => {
        // Update the list of questions
        this.store.dispatch(new UpdateQuestion(updatedQuestion));
      },
      (error) => {console.error(error)}
    )

    this.nextQuestion();
  }

  trackByFn(index: number, item: Question) {
    // console.log('item.id:', item.id);
    return item.id;
  }
}
