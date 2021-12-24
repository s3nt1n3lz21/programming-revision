import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Question } from 'src/app/model/IQuestion';
import { AppStateWrapper } from 'src/app/store/reducer';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  // App State
  questionsStore: Observable<Question[]>;
  questions: Question[];

  constructor(
    private store: Store<AppStateWrapper>,
  ) { 
    this.questionsStore = this.store.select(state => state.state.questions);
  }

  ngOnInit(): void {
    this.questionsStore.subscribe(
      (questions) => {
        this.questions = questions;
      },
      (error) => { console.error(error) }
    )
  }

}
