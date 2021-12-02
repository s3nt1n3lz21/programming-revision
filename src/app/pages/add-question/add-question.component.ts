import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/app.component';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  public addQuestion = () => {
    console.log('adding question');
    this.http.post(
      'https://programming-revision-default-rtdb.europe-west1.firebasedatabase.app/questions.json',
      JSON.stringify({question: 'test question', answer: 'test answer'}),
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
