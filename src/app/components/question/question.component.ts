import { Component, Input, OnInit } from '@angular/core';
import { DAY, Question } from 'src/app/model/IQuestion';
import { ApiService } from 'src/app/services/api.service';
import { Store } from '@ngrx/store';
import { AppState, AppStateWrapper } from 'src/app/store/reducer';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AllActions, SetEditingQuestion, SetQuestions, SetSelectedQuestion, UpdateQuestion } from '../../store/action';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  // Component State
  questions: Question[];

  // App State
  questionsStore: Observable<Question[]>;

  constructor(
    private store: Store<AppStateWrapper>,
    private apiService: ApiService,
    private router: Router
  ) {
    this.questionsStore = this.store.select(state => state.state.questions);
  }

  @Input() question: Question;
  showAnswer: boolean = false;

  ngOnInit(): void {
    console.log('question: ', this.question);
  }

  answeredIncorrectly = () => {
    const updatedQuestion = { ...this.question } ;
    updatedQuestion.timesAnsweredCorrectly = 0;
    updatedQuestion.answerExpiryDate = new Date(Date.now() - DAY).toISOString();

    this.apiService.updateQuestion(updatedQuestion).subscribe(
      () => {
        this.store.dispatch(new UpdateQuestion(updatedQuestion));
      },
      (error) => {console.error(error)}
    )
  }

  answeredCorrectly = () => {
    console.log('question answered correctly');

    // 0 = 1 days
    // 1 = 2 days
    // 2 = 4 days
    // 3 = 8 days
    // 4 = 16 days
    // 5 = 32 days

    const updatedQuestion = { ...this.question } ;
    updatedQuestion.timesAnsweredCorrectly += 1;
    updatedQuestion.answerExpiryDate = new Date(Date.now() + DAY*2**(this.question.timesAnsweredCorrectly)).toISOString();
    this.apiService.updateQuestion(updatedQuestion).subscribe(
      () => {
        // Update the list of questions
        console.log('updated question: ', updatedQuestion);
        this.store.dispatch(new UpdateQuestion(updatedQuestion));
      },
      (error) => {console.error(error)}
    )



    // this.questions[this.index].answerExpiryDate = new Date().toISOString() + this.questions[this.index].timesAnsweredCorrectly*DAY;
    // this.questions[this.index].timesAnsweredCorrectly += 1;
  }

  revealAnswer = () => {
    this.showAnswer = true;
  }

  edit = () => {
    // Set the selected question
    this.store.dispatch(new SetSelectedQuestion(this.question));
    this.store.dispatch(new SetEditingQuestion(true));
    this.router.navigate(['add-question']);
  }
}
