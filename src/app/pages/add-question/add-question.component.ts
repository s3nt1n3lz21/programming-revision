import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { emptyQuestion, IQuestionForm, Question } from 'src/app/model/IQuestion';
import { ApiService } from 'src/app/services/api.service';
import { AppState } from 'src/app/store/reducer';

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

  // App State
  editingQuestion: Observable<boolean>;
  selectedQuestion: Observable<Question>;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
    private apiService: ApiService
  ) { 
    this.editingQuestion = this.store.select('editingQuestion');
    this.selectedQuestion = this.store.select('selectedQuestion');
  }

  ngOnInit(): void {
  }

  public addQuestion = () => {
    const questionFormValues = this.questionForm.value;
    const question: Question = emptyQuestion();
    question.question = questionFormValues.question;
    question.answer = questionFormValues.answer;

    console.log('adding question');

    this.apiService.addQuestion(question).subscribe(
      (response) => {
        console.log('successfully added question', response)
        console.log('question id: ', response['name']);
        question.id = response['name'];
      },
      (error) => {
        console.error(error);
      }
    )
  }

  public editQuestion = () => {};

}
