import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { emptyQuestion, Question } from 'src/app/app.component';
import { IQuestionForm } from 'src/app/model/IQuestion';

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
  ) { }

  ngOnInit(): void {
  }

  public addQuestion = () => {
    const questionFormValues = this.questionForm.value;
    const question: Question = emptyQuestion();
    question.question = questionFormValues.question;
    question.answer = questionFormValues.answer;

    console.log('adding question');
    this.http.post(
      'https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/questions.json',
      JSON.stringify(question),
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
    .subscribe(
      (response) => {
        console.log('successfully added question', response)
        console.log('question id: ', response['name']);
      },
      (error) => {
        console.error(error);
      }
    )
  }

}
