/* eslint-disable no-mixed-spaces-and-tabs */
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
import { LoggerService, LogLevel } from 'src/app/services/logger.service'; // Import LoggerService

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
    private notificationService: NotificationService,
    private logger: LoggerService // Inject LoggerService
  ) { 
  	this.editingQuestionStore = this.store.select(state => state.state.editingQuestion);
  	this.selectedQuestionStore = this.store.select(state => state.state.selectedQuestion);
  }

  ngOnInit(): void {
	this.logger.log(LogLevel.INFO, 'AddQuestionComponent', 'Component initialized'); // Log initialization
  
	this.editingQuestionStore.subscribe((editingQuestion) => {
	  this.editingQuestion = editingQuestion;
	  this.logger.log(LogLevel.DEBUG, 'AddQuestionComponent', 'Editing question state changed', editingQuestion); // Log state change
	});
  
	this.selectedQuestionStore.subscribe((question) => {
	  this.selectedQuestion = question;
	  this.logger.log(LogLevel.DEBUG, 'AddQuestionComponent', 'Selected question state changed', question); // Log selected question change
  
	  // Handle initialization of form even when no question or answer exists
	  const questionWithPrefix = this.addPrefix(question?.question || '', 'Q: ');
	  const answerWithPrefix = this.addPrefix(question?.answer || '', 'A: ');
  
	  this.questionForm.get('question').setValue(questionWithPrefix);
	  this.questionForm.get('answer').setValue(answerWithPrefix);
	  this.tags = this.selectedQuestion?.tags.slice() || [];
	});
  }
  

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  // }

  public addQuestion = () => {
	this.logger.log(LogLevel.INFO, 'AddQuestionComponent', 'Adding a new question'); // Log add question action
	
	const questionFormValues = this.questionForm.value;
	const question: AddQuestion = emptyAddQuestion();
	
	question.question = this.removePrefix(questionFormValues.question, 'Q: '); // Remove prefix
	question.answer = this.removePrefix(questionFormValues.answer, 'A: '); // Remove prefix
	question.timesAnsweredCorrectly = 0;
	question.answerExpiryDate = new Date(Date.now() - DAY).toISOString();
  
	this.logger.log(LogLevel.INFO, 'AddQuestionComponent', 'Adding question: ', question);

	this.apiService.addQuestion(question).subscribe(
	  (response) => {
		this.logger.log(LogLevel.INFO, 'AddQuestionComponent', 'Question added successfully', response); // Log successful add
		this.notificationService.addNotification('Added Question', 'success');
		this.router.navigate(['question-list']);
	  },
	  (error) => {
		this.logger.log(LogLevel.ERROR, 'AddQuestionComponent', 'Failed to add question', error); // Log error
		this.notificationService.addNotification('Failed To Add Question', 'error');
		console.error(error);
	  }
	);
  };

  public editQuestion = () => {
	this.logger.log(LogLevel.INFO, 'AddQuestionComponent', 'Editing existing question'); // Log edit question action
  
	const questionFormValues = this.questionForm.value;
	const question: Question = { ...this.selectedQuestion };
  
	question.question = this.removePrefix(questionFormValues.question, 'Q: '); // Remove prefix
	question.answer = this.removePrefix(questionFormValues.answer, 'A: '); // Remove prefix
	question.tags = this.tags;

	this.logger.log(LogLevel.INFO, 'AddQuestionComponent', 'Updating question: ', question);
  
	this.apiService.updateQuestion(question).subscribe(
	  () => {
		this.logger.log(LogLevel.INFO, 'AddQuestionComponent', 'Question edited successfully'); // Log successful edit
		this.notificationService.addNotification('Edited Question', 'success');
		this.store.dispatch(new UpdateQuestion(question));
		this.store.dispatch(new SetSelectedQuestion(null));
		this.store.dispatch(new SetEditingQuestion(false));
		this.router.navigate(['question-list']);
	  },
	  (error) => {
		this.logger.log(LogLevel.ERROR, 'AddQuestionComponent', 'Failed to edit question', error); // Log error
		this.notificationService.addNotification('Failed To Edit Question', 'error');
		console.error(error);
	  }
	);
  };

  tagSelected(event: MatAutocompleteSelectedEvent): void {
  	this.selectedQuestion.tags.push(event.option.viewValue);
  	this.tagInput.nativeElement.value = '';
  	this.tagCtrl.setValue(null);
    this.logger.log(LogLevel.INFO, 'AddQuestionComponent', 'Tag selected', event.option.viewValue); // Log tag selection
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
      this.logger.log(LogLevel.INFO, 'AddQuestionComponent', 'Tag added', tag); // Log tag added
  	}

  	// Clear the input value
  	this.tagInput.nativeElement.value = '';

  	this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
  	const index = this.selectedQuestion.tags.indexOf(tag);

  	if (index >= 0) {
  		this.selectedQuestion.tags.splice(index, 1);
      this.logger.log(LogLevel.INFO, 'AddQuestionComponent', 'Tag removed', tag); // Log tag removal
  	}
  }

  addPrefix(value: string, prefix: string): string {
	// Ensure the prefix always has a space at the end
	const fullPrefix = prefix.endsWith(': ') ? prefix : `${prefix} `;
	
	// If the value is empty or equals just the prefix, return the prefix
	if (!value || value === fullPrefix.trim()) {
	  return fullPrefix;
	}
  
	// If the value starts with the prefix but the space is removed, reapply the space
	if (value.startsWith(fullPrefix.trim()) && !value.startsWith(fullPrefix)) {
	  return fullPrefix + value.slice(fullPrefix.trim().length);
	}
  
	// Add the prefix if it's not already there
	if (!value.startsWith(fullPrefix)) {
	  return fullPrefix + value;
	}
  
	return value;
  }
  
  removePrefix(value: string, prefix: string): string {
	const fullPrefix = prefix.endsWith(': ') ? prefix : `${prefix} `;
  
	// If the value is only the prefix, reset it to an empty string
	if (value === fullPrefix) {
	  return '';
	}
  
	// Remove the prefix if it exists
	if (value.startsWith(fullPrefix)) {
	  return value.slice(fullPrefix.length);
	}
  
	return value;
  }
  
}
