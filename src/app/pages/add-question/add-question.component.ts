import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddQuestion, DAY, emptyAddQuestion, IQuestionForm, Question } from 'src/app/model/IQuestion';
import { ApiService } from 'src/app/services/api.service';
import { SetEditingQuestion, SetSelectedQuestion, UpdateQuestion } from 'src/app/store/action';
import { AppStateWrapper } from 'src/app/store/reducer';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
	selector: 'app-add-question',
	templateUrl: './add-question.component.html',
	styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {

	// Component State
	public questionForm: IQuestionForm = this.fb.group({
		question: '',
		answer: '',
	});
	selectedQuestion: Question;
	editingQuestion: boolean;
	tags: string[];

	// App State
	editingQuestionStore: Observable<boolean>;
	selectedQuestionStore: Observable<Question>;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  tagCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private store: Store<AppStateWrapper>,
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private notificationService: NotificationService
  ) { 
  	this.editingQuestionStore = this.store.select(state => state.state.editingQuestion);
  	this.selectedQuestionStore = this.store.select(state => state.state.selectedQuestion);
  }

  ngOnInit(): void {
  	this.editingQuestionStore.subscribe((editingQuestion) => {
  		this.editingQuestion = editingQuestion;
  	});

  	this.selectedQuestionStore.subscribe((question) => {
  		this.selectedQuestion = question;
  		if (question) {
  			this.questionForm.get('question').setValue(question.question);
  			this.questionForm.get('answer').setValue(question.answer);
  			this.tags = this.selectedQuestion.tags.slice();
  		}

  		// this.filteredTag = this.tagCtrl.valueChanges.pipe(
  		//   map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
  		// );
  	});
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  // }

  public addQuestion = () => {
  	const questionFormValues = this.questionForm.value;
  	const question: AddQuestion = emptyAddQuestion();
  	question.question = questionFormValues.question;
  	question.answer = questionFormValues.answer;
  	question.timesAnsweredCorrectly = 0;
  	question.answerExpiryDate = new Date(Date.now() - DAY).toISOString();

  	this.apiService.addQuestion(question).subscribe(
  		(response) => {
  			this.notificationService.addNotification('Added Question', 'success');
  			this.router.navigate(['question-list']);
  		},
  		(error) => {
  			this.notificationService.addNotification('Failed To Add Question', 'error');
  			console.error(error);
  		}
  	);
  };

  public editQuestion = () => {
  	const questionFormValues = this.questionForm.value;
  	const question: Question = { ...this.selectedQuestion };
  	question.question = questionFormValues.question;
  	question.answer = questionFormValues.answer;
  	console.log('this.tags: ', this.tags);
  	question.tags = this.tags;
  	console.log('question.tags: ', question.tags);

  	this.apiService.updateQuestion(question).subscribe(
  		() => {
  			this.notificationService.addNotification('Edited Question', 'success');
  			this.store.dispatch(new UpdateQuestion(question));
  			this.store.dispatch(new SetSelectedQuestion(null));
  			this.store.dispatch(new SetEditingQuestion(false));
  			this.router.navigate(['question-list']);
  		},
  		(error) => {
  			this.notificationService.addNotification('Failed To Edit Question', 'error');
  			console.error(error);
  		}
  	);
  };

  tagSelected(event: MatAutocompleteSelectedEvent): void {
  	this.selectedQuestion.tags.push(event.option.viewValue);
  	this.tagInput.nativeElement.value = '';
  	this.tagCtrl.setValue(null);
  }


  add(event: MatChipInputEvent): void {
  	const tag: string = (event.value || '').trim();
  	// console.log('add: ', tag);
  	// console.log(typeof tag);
  	// console.log('this.selectedQuestion.tags: ', this.selectedQuestion.tags);
  	// const newTags: string[] = this.selectedQuestion.tags.slice();
  	// newTags.push(tag);

  	// Add our tag
  	if (tag) {
  		// newTags.push(tag)
  		this.tags.push(tag);
  		console.log('this.tags: ', this.tags);
  	}

  	// Clear the input value
  	this.tagInput.nativeElement.value = '';

  	this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
  	const index = this.selectedQuestion.tags.indexOf(tag);

  	if (index >= 0) {
  		this.selectedQuestion.tags.splice(index, 1);
  	}
  }
}
