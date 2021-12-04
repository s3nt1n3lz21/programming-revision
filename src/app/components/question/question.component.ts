import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/model/IQuestion';
import { Store } from '@ngrx/store';
import { AppStateWrapper } from 'src/app/store/reducer';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SetEditingQuestion, SetSelectedQuestion } from '../../store/action';

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
    private router: Router
  ) {
    this.questionsStore = this.store.select(state => state.state.questions);
  }

  @Input() question: Question;
  @Input() showAnswer: boolean = false;

  ngOnInit(): void {
    console.log('question: ', this.question);
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
