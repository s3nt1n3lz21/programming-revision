import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { DAY, Question } from 'src/app/model/IQuestion';
import { Store } from '@ngrx/store';
import { AppStateWrapper } from 'src/app/store/reducer';
import { Router } from '@angular/router';
import { SetEditingQuestion, SetQuestionIntervals, SetSelectedQuestion, UpdateQuestion } from '../../store/actions';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { ApiService } from 'src/app/services/api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'app-revision-card',
	templateUrl: './revision-card.component.html',
	styleUrls: ['./revision-card.component.scss']
})
export class RevisionCardComponent implements OnInit, OnChanges {

	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
	maxTags = 99;
	private unsubscribe$ = new Subject<void>();
	intervals: number[];

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
	
		this.store.select(state => state.state.questionIntervals)
		.pipe(takeUntil(this.unsubscribe$))
		.subscribe(intervals => {
			this.intervals = intervals;
			this.logger.log(LogLevel.DEBUG, 'RevisionCardComponent', 'Question Intervals loaded', intervals);
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	revealAnswer = () => {
		this.showAnswer = !this.showAnswer;
		this.logger.log(LogLevel.DEBUG, 'RevisionCardComponent', 'Answer visibility toggled:', this.showAnswer);
		this.showAnswerChange.emit(this.showAnswer);
	};

	edit = () => {
		this.logger.log(LogLevel.INFO, 'RevisionCardComponent', 'Navigating to edit question:', this.question.id);
		this.store.dispatch(SetSelectedQuestion({question: this.question}));
		this.store.dispatch(SetEditingQuestion({editingQuestion: true}));
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
		const previousTimesAnsweredCorrectly = updatedQuestion.timesAnsweredCorrectly;
		updatedQuestion.timesAnsweredCorrectly += 1;
	
		if (previousTimesAnsweredCorrectly < this.intervals.length) {
			// Use previousTimesAnsweredCorrectly as the index to get the interval before incrementing
			const interval = this.intervals[previousTimesAnsweredCorrectly];
			updatedQuestion.answerExpiryDate = new Date(Date.now() + interval * DAY).toISOString();
		} else {
			// Add 30 days if the next interval doesn't exist
			const lastInterval = this.intervals[this.intervals.length - 1] || 0;
			const nextInterval = lastInterval + 30;
			updatedQuestion.answerExpiryDate = new Date(Date.now() + nextInterval * DAY).toISOString();
	
			// Add the new interval to the intervals array and dispatch the action
			const updatedIntervals = [...this.intervals, nextInterval];
			this.store.dispatch(SetQuestionIntervals({intervals: updatedIntervals}));
		}
	
		this.apiService.updateQuestion(updatedQuestion).subscribe(
			() => {
				this.store.dispatch(UpdateQuestion({question: updatedQuestion}));
			},
			(error) => {
				console.error(error);
			}
		);
	};
	

	answeredIncorrectly = () => {
		const updatedQuestion: Question = { ...this.question };
		const previousTimesAnsweredCorrectly = updatedQuestion.timesAnsweredCorrectly;
	
		if (previousTimesAnsweredCorrectly >= 0 && previousTimesAnsweredCorrectly < this.intervals.length) {
			// Use previousTimesAnsweredCorrectly directly to fetch the current interval
			const interval = this.intervals[previousTimesAnsweredCorrectly];
	
			// Reduce the interval by 1 day
			const reducedInterval = Math.max(1, interval - 1); // Ensure interval doesn't go below 1 day
			updatedQuestion.answerExpiryDate = new Date(Date.now() + this.intervals[0] * DAY).toISOString();
	
			// Optionally update the intervals array with the reduced interval
			const updatedIntervals = [...this.intervals];
			updatedIntervals[previousTimesAnsweredCorrectly] = reducedInterval;
			this.store.dispatch(SetQuestionIntervals({ intervals: updatedIntervals }));
		} else {
			// If no valid interval exists, just set the expiry date to 1 day from now
			updatedQuestion.answerExpiryDate = new Date(Date.now() + DAY).toISOString();
		}
	
		// Now reset timesAnsweredCorrectly after setting the expiry date
		updatedQuestion.timesAnsweredCorrectly = 0;
	
		this.apiService.updateQuestion(updatedQuestion).subscribe(
			() => {
				this.store.dispatch(UpdateQuestion({ question: updatedQuestion }));
			},
			(error) => {
				console.error(error);
			}
		);
	};
	

	nextQuestion = () => {
		this.nextQuestionEvent.emit(true);
	};
}
