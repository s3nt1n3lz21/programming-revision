import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { DAY, Question } from 'src/app/model/IQuestion';
import { Store } from '@ngrx/store';
import { AppStateWrapper } from 'src/app/store/reducer';
import { Router } from '@angular/router';
import { SetEditingQuestion, SetSelectedQuestion, UpdateQuestion } from '../../store/action';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips'; // Replaced MatLegacyChipInputEvent with MatChipInputEvent
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
	selector: 'app-revision-card',
	templateUrl: './revision-card.component.html',
	styleUrls: ['./revision-card.component.scss']
})
export class RevisionCardComponent implements OnInit, OnChanges {

	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	maxTags = 99;

	constructor(
		private store: Store<AppStateWrapper>,
		private router: Router,
		private logger: LoggerService,
		private apiService: ApiService
	) {}

	@Input() question: Question;
	@Input() showAnswer = false;
	@Input() showSkipButton = false;
	@Output() showAnswerChange = new EventEmitter<boolean>();
	@Output() nextQuestionEvent = new EventEmitter<boolean>();

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.question && !changes.question.firstChange) {
			this.logger.log(LogLevel.INFO, 'RevisionCardComponent', 'Question changed', {
				previousValue: changes.question.previousValue,
				currentValue: changes.question.currentValue,
			});
		}
	}

	ngOnInit(): void {
		this.logger.log(LogLevel.INFO, 'RevisionCardComponent', 'Initialized with question:', this.question);
	}

	revealAnswer = () => {
		this.showAnswer = !this.showAnswer;
		this.logger.log(LogLevel.DEBUG, 'RevisionCardComponent', 'Answer visibility toggled:', this.showAnswer);
		this.showAnswerChange.emit(this.showAnswer);
	};

	edit = () => {
		this.logger.log(LogLevel.INFO, 'RevisionCardComponent', 'Navigating to edit question:', this.question.id);
		this.store.dispatch(new SetSelectedQuestion(this.question));
		this.store.dispatch(new SetEditingQuestion(true));
		this.router.navigate(['add-question']);
	};

	add(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value.trim();

		this.logger.log(LogLevel.DEBUG, 'RevisionCardComponent', 'Tags before adding:', this.question.tags);

		if (value) {
			if (!Array.isArray(this.question.tags)) {
				this.logger.log(LogLevel.ERROR, 'RevisionCardComponent', 'Tags is not an array, initializing');
				this.question.tags = [];
			}

			if (!this.question.tags.includes(value) && this.question.tags.length < this.maxTags) {
				this.question.tags.push(value);
				this.logger.log(LogLevel.INFO, 'RevisionCardComponent', 'Tag added:', value);
			}
		}

		if (input) {
			input.value = '';
		}

		this.logger.log(LogLevel.DEBUG, 'RevisionCardComponent', 'Tags after adding:', this.question.tags);
	}

	remove(tag: string): void {
		const index = this.question.tags.indexOf(tag);

		if (index >= 0) {
			this.question.tags.splice(index, 1);
			this.logger.log(LogLevel.DEBUG, 'RevisionCardComponent', 'Tag removed:', tag);
		}
	}

	trackByFn(index: number, tag: string): string {
		return tag;
	}

	isMaxTagsReached(): boolean {
		const isReached = this.question.tags.length >= this.maxTags;
		if (isReached) {
			this.logger.log(LogLevel.WARN, 'RevisionCardComponent', 'Max tag limit reached');
		}
		return isReached;
	}

	answeredCorrectly = () => {
		const updatedQuestion = { ...this.question };
		updatedQuestion.timesAnsweredCorrectly += 1;

		if (this.question.timesAnsweredCorrectly <= 5) {
			updatedQuestion.answerExpiryDate = new Date(Date.now() + DAY * 2 ** this.question.timesAnsweredCorrectly).toISOString();
		} else {
			updatedQuestion.answerExpiryDate = new Date(Date.now() + (30 * DAY) * (this.question.timesAnsweredCorrectly - 4)).toISOString();
		}

		this.apiService.updateQuestion(updatedQuestion).subscribe(
			() => {
				this.store.dispatch(new UpdateQuestion(updatedQuestion));
			},
			(error) => { console.error(error); }
		);
	};

	answeredIncorrectly = () => {
		const updatedQuestion: Question = { ...this.question };
		updatedQuestion.timesAnsweredCorrectly = 0;
		updatedQuestion.answerExpiryDate = new Date(Date.now() - DAY).toISOString();

		this.apiService.updateQuestion(updatedQuestion).subscribe(
			() => {
				this.store.dispatch(new UpdateQuestion(updatedQuestion));
			},
			(error) => { console.error(error); }
		);
	};

	nextQuestion = () => {
		this.nextQuestionEvent.emit(true);
	};
}
