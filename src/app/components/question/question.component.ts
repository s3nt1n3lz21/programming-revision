import { Component, Input, OnInit } from '@angular/core';
import { Question } from 'src/app/model/IQuestion';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  constructor() { }

  @Input() question: Question;
  showAnswer: boolean = false;

  ngOnInit(): void {
    console.log('question: ', this.question);
  }

  answeredCorrectly = () => {}

  revealAnswer = () => {
    this.showAnswer = true;
  }
}
