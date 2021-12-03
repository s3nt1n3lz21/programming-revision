import { Component, Input, OnInit } from '@angular/core';
import { DAY, Question } from 'src/app/model/IQuestion';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {

  constructor(private apiService: ApiService) { }

  @Input() question: Question;
  showAnswer: boolean = false;

  ngOnInit(): void {
    console.log('question: ', this.question);
  }

  answeredCorrectly = () => {
    console.log('question answered correctly');

    const newQuestion = { ...this.question } ;
    newQuestion.answerExpiryDate = new Date().toISOString() + this.question.timesAnsweredCorrectly*DAY;
    this.apiService.updateQuestion(newQuestion);

    // this.questions[this.index].answerExpiryDate = new Date().toISOString() + this.questions[this.index].timesAnsweredCorrectly*DAY;
    // this.questions[this.index].timesAnsweredCorrectly += 1;
  }

  revealAnswer = () => {
    this.showAnswer = true;
  }
}
