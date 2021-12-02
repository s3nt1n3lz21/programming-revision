import { FormGroup } from "@angular/forms";

export interface IQuestionFormValues {
    question: string;
    answer: string;
}

export interface IQuestionForm extends FormGroup {
    value: IQuestionFormValues;
}