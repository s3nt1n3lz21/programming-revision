import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/model/IQuestion';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  constructor(private apiService: ApiService) { }
  questions: Question[] = [];

  ngOnInit(): void {
    this.apiService.getQuestions().subscribe(
      (data) => {
        const questions = [];
        for (const key in data) {
          questions.push(data[key]);
        }
  
        this.questions = questions;
      },
      (error) => {
        console.error(error);
      }
    )
  }

}
