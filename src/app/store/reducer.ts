import { Question } from '../model/IQuestion';
import { AllActions, UPDATE_QUESTION, SET_EDITING_QUESTION, SET_QUESTIONS, SET_SELECTED_QUESTION, ADD_QUESTION, SET_QUESTION_INTERVALS, UPDATE_QUESTION_INTERVALS } from './action';

export interface AppStateWrapper {
    state: AppState
}

export interface AppState {
    selectedQuestion: Question;
    questions: Question[];
    editingQuestion: boolean;
    questionIntervals: number[];
}

const initialState: AppState = {
    selectedQuestion: null,
    questions: [],
    editingQuestion: false,
    questionIntervals: [0, 1, 2, 4, 8, 16, 32, 64]
};

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
            const index = state.questions.findIndex((q) => q.id === action.question.id);
            const newQuestions = [...state.questions];
            if (index >= 0) {
                newQuestions[index] = action.question;
                newState = { ...state, questions: newQuestions};
                console.log(action.type, newState);
                return newState;
            } else {
                return state;
            }
        case SET_EDITING_QUESTION:
            newState = { ...state, editingQuestion: action.editingQuestion }
            console.log(action.type, newState);
            return newState;
        case ADD_QUESTION:
            newState = { ...state, questions: [...state.questions, action.question] };
            console.log(action.type, newState);
            return newState;
        case SET_QUESTION_INTERVALS:
            return {
                ...state,
                intervals: action.intervals
            };
        case UPDATE_QUESTION_INTERVALS:
            return {
                ...state,
                intervals: action.intervals
            };
        default:
            return state;
    }
}