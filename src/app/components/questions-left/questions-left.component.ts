/* eslint-disable @typescript-eslint/no-inferrable-types */
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { AppStateWrapper } from 'src/app/store/reducer';

@Component({
  selector: 'app-questions-left',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questions-left.component.html',
  styleUrl: './questions-left.component.scss'
})
export class QuestionsLeftComponent {
  @Input() noQuestions: number = 0;
  @Input() noRevisedQuestions: number = 0;

  public intervalsStore: Observable<number[]>;
	public intervals: number[] = [4, 8, 16];

  constructor(
    private store: Store<AppStateWrapper>,
    private logger: LoggerService
  ) {
    this.intervalsStore = this.store.select(state => state.state.questionIntervals);
    this.logger.log(LogLevel.INFO, 'QuestionsLeftComponent', 'Component created');
  }

  ngOnInit(): void {
    this.intervalsStore.subscribe(
      (intervals) => {
        this.intervals = intervals;
        this.logger.log(LogLevel.DEBUG, 'QuestionsLeftComponent', 'Question Intervals loaded', intervals);
      },
      (error) => { 
        this.logger.log(LogLevel.ERROR, 'QuestionsLeftComponent', 'Error loading question intervals', error); 
      }
    );
  }

  get questionsLeft(): number {
    console.log('this.noQuestions: ', this.noQuestions);
    console.log('this.noRevisedQuestions: ', this.noRevisedQuestions);
    return this.noQuestions - this.noRevisedQuestions;
  }

  get progressPercentage(): number {
    return (this.noRevisedQuestions / this.noQuestions) * 100;
  }
}
