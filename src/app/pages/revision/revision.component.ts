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
	chartData: BarChartData[] = [
		{ id: 'd1', value: 10, title: 'USA' },
		{ id: 'd2', value: 11, title: 'India' },
		{ id: 'd3', value: 12, title: 'China' },
		{ id: 'd4', value: 6, title: 'Germany' },
	];

	// App State
	questionsStore: Observable<Question[]>;
	questions: Question[];

	constructor(
    private store: Store<AppStateWrapper>,
    private apiService: ApiService
	) { 
		this.questionsStore = this.store.select(state => state.state.questions);
	}

	ngOnInit(): void {
		this.questionsStore.subscribe(
			(questions) => {
				this.questions = questions;
				this.chartData = this.questions.filter((q) => q.answer)
					.map((q) => {
						return {
							id: q.id,
							value: q.timesAnsweredCorrectly,
							title: q.question
						};
					});
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
			const timesAnsweredCorrectly = this.questions.map(x => x.timesAnsweredCorrectly);
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

	answeredIncorrectly = () => {
		const updatedQuestion: Question = { ...this.currentQuestion } ;
		updatedQuestion.timesAnsweredCorrectly = 0;
		updatedQuestion.answerExpiryDate = new Date(Date.now() - DAY).toISOString();

		this.apiService.updateQuestion(updatedQuestion).subscribe(
			() => {
				this.store.dispatch(new UpdateQuestion(updatedQuestion));
			},
			(error) => {console.error(error);}
		);
		this.nextQuestion();
	};

	answeredCorrectly = () => {
		const updatedQuestion = { ...this.currentQuestion } ;
		updatedQuestion.timesAnsweredCorrectly += 1;
		
		// Exponential up 30 days, then linear and add 1 extra month each time.
		if (this.currentQuestion.timesAnsweredCorrectly <= 5) {
			// 2^0 = 1 Day, 2^1 = 2 Days, 2^2 = 4 Days, 2^3 = 8 Days, 2^4 = 16 Days, 2^5 = 32 Days
			updatedQuestion.answerExpiryDate = new Date(Date.now() + DAY*2**(this.currentQuestion.timesAnsweredCorrectly)).toISOString(); 
		} else {
			// y = now + MONTH*(x-4) e.g. 2 Month, 3 Month
			updatedQuestion.answerExpiryDate = new Date(Date.now() + (30*DAY)*(this.currentQuestion.timesAnsweredCorrectly - 4)).toISOString();
		}
		
		this.apiService.updateQuestion(updatedQuestion).subscribe(
			() => {
				// Update the list of questions
				this.store.dispatch(new UpdateQuestion(updatedQuestion));
			},
			(error) => {console.error(error);}
		);

		this.nextQuestion();
	};

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
