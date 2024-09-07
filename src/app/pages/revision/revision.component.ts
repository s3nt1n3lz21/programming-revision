import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Question, emptyQuestion } from 'src/app/model/IQuestion';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { AppStateWrapper } from 'src/app/store/reducer';

@Component({
	selector: 'app-revision',
	templateUrl: './revision.component.html',
	styleUrls: ['./revision.component.scss']
})
export class RevisionComponent implements OnInit {

	// Component State
	currentQuestion: Question = emptyQuestion();
	index = 0;
	showCurrentAnswer = false;

	// App State
	questionsStore: Observable<Question[]>;
	questions: Question[] = [];

	constructor(
		private store: Store<AppStateWrapper>,
		private logger: LoggerService // Injecting LoggerService
	) { 
		this.questionsStore = this.store.select(state => state.state.questions);
		this.logger.log(LogLevel.INFO, 'RevisionComponent', 'Component created');
	}

	ngOnInit(): void {
		this.logger.log(LogLevel.INFO, 'RevisionComponent', 'ngOnInit called');
		this.questionsStore.subscribe(
			(questions) => {
				this.questions = questions;
				this.logger.log(LogLevel.DEBUG, 'RevisionComponent', 'Questions loaded', questions);
				this.nextQuestion();
			},
			(error) => { 
				this.logger.log(LogLevel.ERROR, 'RevisionComponent', 'Error loading questions', error); 
			}
		);
	}

	public questionsLeft() {
		const hasQuestionsLeft = this.questions.some((q) => q.answer != '' && new Date(q.answerExpiryDate) < new Date());
		this.logger.log(LogLevel.DEBUG, 'RevisionComponent', 'Checking questions left', hasQuestionsLeft);
		return hasQuestionsLeft;
	}

	public selectQuestion(question: Question) {
		this.logger.log(LogLevel.INFO, 'RevisionComponent', 'Selecting question', question);
		this.showCurrentAnswer = false;
		this.index = this.questions.findIndex(q => q.id === question.id);
		this.currentQuestion = question;
	}

	public nextQuestion() {
		this.logger.log(LogLevel.INFO, 'RevisionComponent', 'Next question requested');
		let randomIndex = 0;

		if (this.questionsLeft()) {
			let answeredThisQuestion = true;
			let limit = 0;
			const timesAnsweredCorrectly = this.questions.filter(x => new Date(x.answerExpiryDate) < new Date() && x.question && x.answer).map(x => x.timesAnsweredCorrectly);
			const leastTimesAnsweredCorrectly = Math.min(...timesAnsweredCorrectly);
			const questionsAnsweredTheLeast = this.questions.filter(x => x.timesAnsweredCorrectly == leastTimesAnsweredCorrectly);

			while (answeredThisQuestion && limit < 10000) {
				randomIndex = Math.floor(Math.random() * questionsAnsweredTheLeast.length);
				if ((new Date(questionsAnsweredTheLeast[randomIndex].answerExpiryDate) < new Date()) && questionsAnsweredTheLeast[randomIndex].answer) {
					answeredThisQuestion = false;
				}
				limit += 1;
			}
    
			this.index = this.questions.findIndex(x => x.id == questionsAnsweredTheLeast[randomIndex].id);
			this.logger.log(LogLevel.DEBUG, 'RevisionComponent', 'Next question selected', this.questions[this.index]);
		} else {
			this.index = 0;
			this.logger.log(LogLevel.INFO, 'RevisionComponent', 'No questions left');
		}

		this.showCurrentAnswer = false;
		this.currentQuestion = this.questions[this.index];
	}

	trackByFn(index: number, item: Question) {
		this.logger.log(LogLevel.DEBUG, 'RevisionComponent', 'Tracking question by id', item.id);
		return item.id;
	}

	public sum() {
		const total = this.questions.map(q => q.timesAnsweredCorrectly).reduce((previousValue, currentValue) => previousValue + currentValue, 0);
		this.logger.log(LogLevel.INFO, 'RevisionComponent', 'Sum of correct answers', total);
		return total;
	}

	public noQuestionsLeft() {
		const noQuestions = this.questions.map(q => new Date(q.answerExpiryDate) < new Date() ).reduce((previousValue, currentValue) => previousValue + Number(currentValue), 0);
		this.logger.log(LogLevel.INFO, 'RevisionComponent', 'No questions left', noQuestions);
		return noQuestions;
	}
}
