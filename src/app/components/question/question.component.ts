import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/app.component';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  constructor() { }

  @Input() question: Question;

  ngOnInit(): void {}

  answeredCorrectly = () => {}

}
