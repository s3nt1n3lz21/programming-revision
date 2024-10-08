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
	
		// Increment the timesAnsweredCorrectly
		updatedQuestion.timesAnsweredCorrectly += 1;
	
		// Update the previous interval by 1 day, if it exists
		const updatedIntervals = [...this.intervals];
		if (previousTimesAnsweredCorrectly < updatedIntervals.length) {
			const previousInterval = updatedIntervals[previousTimesAnsweredCorrectly];
			const updatedPreviousInterval = previousInterval + 1;
	
			// Update the intervals array with the updated previous interval
			updatedIntervals[previousTimesAnsweredCorrectly] = updatedPreviousInterval;
		}
	
		// If timesAnsweredCorrectly is greater than the current length of intervals, append new intervals
		while (updatedQuestion.timesAnsweredCorrectly >= updatedIntervals.length) {
			const lastInterval = updatedIntervals[updatedIntervals.length - 1] || 30; // Start with 30 if no intervals
			updatedIntervals.push(lastInterval + 30); // Add 30 more than the previous interval
		}
	
		// Set the next answer expiry date based on the updated intervals
		const nextInterval = updatedIntervals[updatedQuestion.timesAnsweredCorrectly];
		updatedQuestion.answerExpiryDate = new Date(Date.now() + nextInterval * DAY).toISOString();
	
		// Dispatch the updated intervals to the store
		this.store.dispatch(SetQuestionIntervals({ intervals: updatedIntervals }));
	
		// Update the question in the API and store
		this.apiService.updateQuestion(updatedQuestion).subscribe(
			() => {
				this.store.dispatch(UpdateQuestion({ question: updatedQuestion }));
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
			const reducedInterval = Math.max(0, interval - 1);
			updatedQuestion.answerExpiryDate = new Date(Date.now()).toISOString();
	
			// Optionally update the intervals array with the reduced interval
			const updatedIntervals = [...this.intervals];
			updatedIntervals[previousTimesAnsweredCorrectly] = reducedInterval;
			this.store.dispatch(SetQuestionIntervals({ intervals: updatedIntervals }));
		} else {
			// If no valid interval exists, just set the expiry date to 1 day from now
			updatedQuestion.answerExpiryDate = new Date(Date.now() + DAY).toISOString();
		}
	
		// Decrease timesAnsweredCorrectly by 1 but not below 0
		updatedQuestion.timesAnsweredCorrectly = Math.max(0, previousTimesAnsweredCorrectly - 1);
	
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
