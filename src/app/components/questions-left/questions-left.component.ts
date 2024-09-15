/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-questions-left',
  standalone: true,
  imports: [],
  templateUrl: './questions-left.component.html',
  styleUrl: './questions-left.component.scss'
})
export class QuestionsLeftComponent {
  @Input() noQuestions: number = 0;
  @Input() noRevisedQuestions: number = 0;

  get questionsLeft(): number {
    console.log('this.noQuestions: ', this.noQuestions);
    console.log('this.noRevisedQuestions: ', this.noRevisedQuestions);
    return this.noQuestions - this.noRevisedQuestions;
  }

  get progressPercentage(): number {
    return (this.noRevisedQuestions / this.noQuestions) * 100;
  }
}
