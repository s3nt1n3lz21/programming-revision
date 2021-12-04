import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from 'src/app/model/IQuestion';
import { Store } from '@ngrx/store';
import { AppStateWrapper } from 'src/app/store/reducer';
import { Router } from '@angular/router';
import { SetEditingQuestion, SetSelectedQuestion } from '../../store/action';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  constructor(
    private store: Store<AppStateWrapper>,
    private router: Router
  ) {}

  @Input() question: Question;
  @Input() showAnswer: boolean = false;
  @Output() showAnswerChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    console.log('question: ', this.question);
  }

  revealAnswer = () => {
    this.showAnswer = true;
    this.showAnswerChange.emit(this.showAnswer);
  }

  edit = () => {
    // Set the selected question
    this.store.dispatch(new SetSelectedQuestion(this.question));
    this.store.dispatch(new SetEditingQuestion(true));
    this.router.navigate(['add-question']);
  }
}
