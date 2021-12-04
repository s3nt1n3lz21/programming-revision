import { Question } from '../model/IQuestion';
import { AllActions, UPDATE_QUESTION, SET_EDITING_QUESTION, SET_QUESTIONS, SET_SELECTED_QUESTION } from './action';

export interface AppStateWrapper {
    state: AppState
};

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
    let newState: AppState = null;

    switch (action.type) {
        case SET_SELECTED_QUESTION:
            newState = { ...state, selectedQuestion: action.question };
            console.log(action.type, newState);
            return newState;
        case SET_QUESTIONS:
            newState = { ...state, questions: action.questions };
            console.log(action.type, newState);
            return newState;
        case UPDATE_QUESTION:
            newState = { ...state };
            const index = newState.questions.findIndex((q) => q.id === action.question.id);
            console.log('updating question index: ', index);
            if (index >= 0) {
                newState.questions[index] = action.question;
                console.log(action.type, newState);
                return newState;
            } else {
                return state;
            }
        case SET_EDITING_QUESTION:
            newState = { ...state, editingQuestion: action.editingQuestion }
            console.log(action.type, newState);
            return newState;
        default:
            return state;
    }
}