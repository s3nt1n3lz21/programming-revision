import { FormGroup } from "@angular/forms";

export interface IQuestionFormValues {
    question: string;
    answer: string;
}

export interface IQuestionForm extends FormGroup {
    value: IQuestionFormValues;
}

export const DAY = 86400000; // 1 day in milliseconds

export interface Question {
  question: string;
  answer: string;
  answerExpiryDate: string
  timesAnsweredCorrectly: number
}

export function emptyQuestion(): Question {
  return {
    question: '',
    answer: '',
    answerExpiryDate: new Date().toISOString(),
    timesAnsweredCorrectly: 0
  }
}