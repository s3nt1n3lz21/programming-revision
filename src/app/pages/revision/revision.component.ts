import { Component, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BarChartData } from 'src/app/model/IBarChart';
import { Question, emptyQuestion, DAY } from 'src/app/model/IQuestion';
import { ApiService } from 'src/app/services/api.service';
import { UpdateQuestion } from 'src/app/store/action';
import { AppStateWrapper } from 'src/app/store/reducer';
import { EventEmitter } from 'stream';

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
				this.nextQuestion();
			},
			(error) => { console.error(error); }
		);
	}

	// There are questions with answers that we haven't answered
	public questionsLeft() {
		return this.questions.some((q) => q.answer != '' && new Date(q.answerExpiryDate) < new Date());
	}

	public selectQuestion = (question: Question) => {
		// if (new Date(question.answerExpiryDate) < new Date()) {
		this.showCurrentAnswer = false;
		this.index = this.questions.findIndex(q => q.id === question.id);
		this.currentQuestion = question;
		// }
	};
  
	public nextQuestion() {
		let randomIndex = 0;

		if (this.questionsLeft()) {
			let answeredThisQuestion = true;
			let limit = 0;
			// Find the questions i've answered the least
			const timesAnsweredCorrectly = this.questions.filter(x => new Date(x.answerExpiryDate) < new Date() && x.question && x.answer).map(x => x.timesAnsweredCorrectly);
			const leastTimesAnsweredCorrectly = Math.min(...timesAnsweredCorrectly);
			const questionsAnsweredTheLeast = this.questions.filter(x => x.timesAnsweredCorrectly == leastTimesAnsweredCorrectly);

			// Get a random question that we haven't answered
			while (answeredThisQuestion && limit < 10000) {
				randomIndex = Math.floor(Math.random()*questionsAnsweredTheLeast.length);
				if ((new Date(questionsAnsweredTheLeast[randomIndex].answerExpiryDate) < new Date()) && questionsAnsweredTheLeast[randomIndex].answer) {
					answeredThisQuestion = false;
				}
				limit += 1;
			}
    
			this.index = this.questions.findIndex(x => x.id == questionsAnsweredTheLeast[randomIndex].id);
		} else {
			this.index = 0;
		}

		this.showCurrentAnswer = false;
		this.currentQuestion = this.questions[this.index];
	}

	trackByFn(index: number, item: Question) {
		// console.log('item.id:', item.id);
		return item.id;
	}

	public sum() {
		return this.questions.map(q => q.timesAnsweredCorrectly).reduce((previousValue, currentValue) => previousValue + currentValue, 0);
	}

	public noQuestionsLeft() {
		return this.questions.map(q => new Date(q.answerExpiryDate) < new Date() ).reduce((previousValue, currentValue) => previousValue + Number(currentValue), 0);
	}
}
