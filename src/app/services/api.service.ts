import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddQuestion, emptyAddQuestion, Question } from '../model/IQuestion';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	public token: string = null;

	constructor(private http: HttpClient) { }

	getQuestions(): Observable<Question[]> {
		return this.http.get<Question[]>('https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/questions.json');
	}

	updateQuestion(question: Question) {
		const questionWithoutID: AddQuestion = emptyAddQuestion();
		questionWithoutID.answer = question.answer;
		questionWithoutID.question = question.question;
		questionWithoutID.answerExpiryDate = question.answerExpiryDate;
		questionWithoutID.timesAnsweredCorrectly = question.timesAnsweredCorrectly;
		questionWithoutID.tags = question.tags;

		return this.http.put(
			//?auth=${this.token}
			`https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/questions/${question.id}.json`,
			JSON.stringify(questionWithoutID),
			{
				headers: {
					'Content-Type': 'application/json',
				}
			}
		);
	}

	addQuestion(question: AddQuestion) {
		return this.http.post(
			'https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/questions.json',
			JSON.stringify(question),
			{
				headers: {
					'Content-Type': 'application/json',
				}
			}
		);
	}

	getQuestionIntervals(): Observable<number[]> {
		return this.http.get<number[]>('https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/intervals.json');
	}

	updateQuestionIntervals(intervals: number[]): Observable<void> {
		return this.http.put<void>(
			'https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/intervals.json',
			JSON.stringify(intervals),
			{ headers: { 'Content-Type': 'application/json' } }
		);
	}
}
