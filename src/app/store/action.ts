import { Action } from '@ngrx/store';
import { Question } from '../model/IQuestion';

export const SET_SELECTED_QUESTION = 'SET_SELECTED_QUESTION';
export const SET_QUESTIONS = 'SET_QUESTIONS';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';
export const SET_EDITING_QUESTION = 'SET_EDITING_QUESTION';
export const ADD_QUESTION = 'ADD_QUESTION';
export const SET_QUESTION_INTERVALS = 'SET_QUESTION_INTERVALS';
export const UPDATE_QUESTION_INTERVALS = 'UPDATE_QUESTION_INTERVALS';

export class SetSelectedQuestion implements Action {
    readonly type = SET_SELECTED_QUESTION;

    constructor(public question: Question) {}
}

export class SetQuestions implements Action {
    readonly type = SET_QUESTIONS;

    constructor(public questions: Question[]) {}
}

export class UpdateQuestion implements Action {
    readonly type = UPDATE_QUESTION;

    constructor(public question: Question) {}
}

export class SetEditingQuestion implements Action {
    readonly type = SET_EDITING_QUESTION;

    constructor(public editingQuestion: boolean) {}
}

export class AddQuestionAction implements Action {
    readonly type = ADD_QUESTION;

    constructor(public question: Question) {}
}

export class SetQuestionIntervals implements Action {
    readonly type = SET_QUESTION_INTERVALS;

    constructor(public intervals: number[]) {}
}

export class UpdateQuestionIntervals implements Action {
    readonly type = UPDATE_QUESTION_INTERVALS;

    constructor(public intervals: number[]) {}
}

export type AllActions = 
    SetQuestions | 
    SetSelectedQuestion |
    UpdateQuestion |
    SetEditingQuestion |
    AddQuestionAction |
    SetQuestionIntervals |
    UpdateQuestionIntervals;