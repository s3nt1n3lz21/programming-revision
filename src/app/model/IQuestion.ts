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
    id: string;
    question: string;
    answer: string;
    answerExpiryDate: string;
    timesAnsweredCorrectly: number;
    tags: string[];
}

export interface AddQuestion {
    question: string;
    answer: string;
    answerExpiryDate: string;
    timesAnsweredCorrectly: number;
    tags: string[];
}

export function emptyQuestion(): Question {
  return {
    id: '',
    question: '',
    answer: '',
    answerExpiryDate: new Date().toISOString(),
    timesAnsweredCorrectly: 0,
    tags: []
  }
}

export function emptyAddQuestion(): AddQuestion {
  return {
    question: '',
    answer: '',
    answerExpiryDate: new Date().toISOString(),
    timesAnsweredCorrectly: 0,
    tags: []
  }
}