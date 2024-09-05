import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from 'src/app/model/IQuestion';
import { Store } from '@ngrx/store';
import { AppStateWrapper } from 'src/app/store/reducer';
import { Router } from '@angular/router';
import { SetEditingQuestion, SetSelectedQuestion } from '../../store/action';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { LoggerService, LogLevel } from 'src/app/services/logger.service'; // Import LoggerService and LogLevel

@Component({
	selector: 'app-question',
	templateUrl: './question.component.html',
	styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	maxTags = 99;

	constructor(
    private store: Store<AppStateWrapper>,
    private router: Router,
    private logger: LoggerService  // Inject LoggerService
	) {}

  @Input() question: Question;
  @Input() showAnswer = false;
  @Output() showAnswerChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.logger.log(LogLevel.INFO, 'QuestionComponent', 'Initialized with question:', this.question);
  }

  revealAnswer = () => {
    this.showAnswer = !this.showAnswer;
    this.logger.log(LogLevel.DEBUG, 'QuestionComponent', 'Answer visibility toggled:', this.showAnswer);
    this.showAnswerChange.emit(this.showAnswer);
  };

  edit = () => {
    this.logger.log(LogLevel.INFO, 'QuestionComponent', 'Navigating to edit question:', this.question.id);
    this.store.dispatch(new SetSelectedQuestion(this.question));
    this.store.dispatch(new SetEditingQuestion(true));
    this.router.navigate(['add-question']);
  };

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value.trim();

    if (value && !this.question.tags.includes(value) && this.question.tags.length < this.maxTags) {
      this.question.tags.push(value);
      this.logger.log(LogLevel.DEBUG, 'QuestionComponent', 'Tag added:', value);
    }

    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.question.tags.indexOf(tag);

    if (index >= 0) {
      this.question.tags.splice(index, 1);
      this.logger.log(LogLevel.DEBUG, 'QuestionComponent', 'Tag removed:', tag);
    }
  }

  trackByFn(index: number, tag: string): string {
    return tag;
  }

  isMaxTagsReached(): boolean {
    const isReached = this.question.tags.length >= this.maxTags;
    if (isReached) {
      this.logger.log(LogLevel.WARN, 'QuestionComponent', 'Max tag limit reached');
    }
    return isReached;
  }
}
