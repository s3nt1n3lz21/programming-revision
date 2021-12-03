import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddQuestion, emptyAddQuestion, IQuestionForm, Question } from 'src/app/model/IQuestion';
import { ApiService } from 'src/app/services/api.service';
import { SetEditingQuestion, SetSelectedQuestion, UpdateQuestion } from 'src/app/store/action';
import { AppStateWrapper } from 'src/app/store/reducer';

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

  // App State
  editingQuestionStore: Observable<boolean>;
  selectedQuestionStore: Observable<Question>;

  constructor(
    private store: Store<AppStateWrapper>,
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) { 
    this.editingQuestionStore = this.store.select(state => state.state.editingQuestion);
    this.selectedQuestionStore = this.store.select(state => state.state.selectedQuestion);
  }

  ngOnInit(): void {
    this.editingQuestionStore.subscribe((editingQuestion) => {
      this.editingQuestion = editingQuestion;
    })

    this.selectedQuestionStore.subscribe((question) => {
      this.selectedQuestion = question;
      if (question) {
        this.questionForm.get('question').setValue(question.question);
        this.questionForm.get('answer').setValue(question.answer);
      }
    })
  }

  public addQuestion = () => {
    const questionFormValues = this.questionForm.value;
    const question: AddQuestion = emptyAddQuestion();
    question.question = questionFormValues.question;
    question.answer = questionFormValues.answer;

    console.log('adding question');

    this.apiService.addQuestion(question).subscribe(
      (response) => {
        console.log('successfully added question', response);
        console.log('question id: ', response['name']);
        this.router.navigate(['question-list']);
      },
      (error) => {
        console.error(error);
      }
    )
  }

  public editQuestion = () => {
    const questionFormValues = this.questionForm.value;
    let question: Question = { ...this.selectedQuestion };
    question.question = questionFormValues.question;
    question.answer = questionFormValues.answer;

    this.apiService.updateQuestion(question).subscribe(
      () => {
        this.store.dispatch(new UpdateQuestion(question));
        this.store.dispatch(new SetSelectedQuestion(null));
        this.store.dispatch(new SetEditingQuestion(false));
      },
      (error) => {console.error(error)}
    )
  };
}
