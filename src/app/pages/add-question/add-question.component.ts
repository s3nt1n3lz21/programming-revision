import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { emptyQuestion, IQuestionForm, Question } from 'src/app/model/IQuestion';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {

  public questionForm: IQuestionForm = this.fb.group({
    question: '',
    answer: '',
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private apiService: ApiService
  ) { }

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

}
