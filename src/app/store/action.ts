import { Action } from '@ngrx/store';
import { Question } from '../model/IQuestion';

export const SET_SELECTED_QUESTION = 'SET_SELECTED_QUESTION';
export const SET_QUESTIONS = 'SET_QUESTIONS';
export const EDIT_QUESTION = 'EDIT_QUESTION';
export const SET_EDITING_QUESTION = 'SET_EDITING_QUESTION';

export class SetSelectedQuestion implements Action {
    readonly type = SET_SELECTED_QUESTION;

    constructor(public question: Question) {}
}

export class SetQuestions implements Action {
    readonly type = SET_QUESTIONS;

    constructor(public questions: Question[]) {}
}

export class EditQuestion implements Action {
    readonly type = EDIT_QUESTION;

    constructor(public question: Question) {}
}

export class SetEditingQuestion implements Action {
    readonly type = SET_EDITING_QUESTION;

    constructor(public editingQuestion: boolean) {}
}

export type AllActions = 
    SetQuestions | 
    SetSelectedQuestion |
    EditQuestion |
    SetEditingQuestion;