import { Component, OnInit } from '@angular/core';
import { Question } from 'src/app/app.component';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {

  constructor() { }
  questions: Question[] = [];

  ngOnInit(): void {
  }

}
