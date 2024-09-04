import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Question } from 'src/app/model/IQuestion';
import { Store } from '@ngrx/store';
import { AppStateWrapper } from 'src/app/store/reducer';
import { Router } from '@angular/router';
import { SetEditingQuestion, SetSelectedQuestion } from '../../store/action';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
	selector: 'app-question',
	templateUrl: './question.component.html',
	styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

	// Define the separator key codes for adding tags
	readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    
	constructor(
        private store: Store<AppStateWrapper>,
        private router: Router
	) {}

    @Input() question: Question;
    @Input() showAnswer = false;
    @Output() showAnswerChange = new EventEmitter<boolean>();

    ngOnInit(): void {}

    // Toggle the display of the answer
    revealAnswer = () => {
    	this.showAnswer = !this.showAnswer;
    	this.showAnswerChange.emit(this.showAnswer);
    };

    // Navigate to the edit page
    edit = () => {
    	this.store.dispatch(new SetSelectedQuestion(this.question));
    	this.store.dispatch(new SetEditingQuestion(true));
    	this.router.navigate(['add-question']);
    };

    // Add a new tag
    add(event: MatChipInputEvent): void {
		console.log('adding tag: ', event);
    	const input = event.input;
    	const value = event.value.trim();

    	// Add the tag if it's not empty and doesn't already exist
    	if (value && !this.question.tags.includes(value)) {
    		this.question.tags.push(value);
    		// Optionally, update the store or perform other actions here
    	}

    	// Reset the input value
    	if (input) {
    		input.value = '';
    	}
    }

    // Remove an existing tag
    remove(tag: string): void {
		console.log('removing tag: ', tag);
    	const index = this.question.tags.indexOf(tag);

    	if (index >= 0) {
    		this.question.tags.splice(index, 1);
    		// Optionally, update the store or perform other actions here
    	}
    }
}
