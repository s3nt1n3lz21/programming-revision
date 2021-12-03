import { Question } from '../model/IQuestion';
import { AllActions, EDIT_QUESTION, SET_EDITING_QUESTION, SET_QUESTIONS, SET_SELECTED_QUESTION } from './action';

export interface AppState {
    selectedQuestion: Question;
    questions: Question[];
    editingQuestion: boolean;
}

const initialState: AppState = {
    selectedQuestion: null,
    questions: [],
    editingQuestion: false
}

export function reducer(state: AppState = initialState, action: AllActions) {
    console.log(action.type, state);
    let newState = null;

    switch (action.type) {
        case SET_SELECTED_QUESTION:
            newState = { ...state, selectedQuestion: action.question };
            return newState;
        case SET_QUESTIONS:
            newState = { ...state, questions: action.questions };
            return newState;
        case EDIT_QUESTION:
            newState = { ...state, question: action.question };
            return newState;
        case SET_EDITING_QUESTION:
            newState = { ...state, editingQuestion: action.editingQuestion }
        default:
            return state;
    }
}