import { createReducer, on } from '@ngrx/store';
import { 
    SetSelectedQuestion, 
    SetQuestions, 
    UpdateQuestion, 
    SetEditingQuestion, 
    AddQuestion, 
    SetQuestionIntervals, 
    UpdateQuestionIntervals 
} from './actions';
import { Question } from '../model/IQuestion';

export interface AppStateWrapper {
    state: AppState;
}

export interface AppState {
    selectedQuestion: Question | null;
    questions: Question[];
    editingQuestion: boolean;
    questionIntervals: number[];
}

const initialState: AppState = {
    selectedQuestion: null,
    questions: [],
    editingQuestion: false,
    questionIntervals: [0, 1, 2, 4, 8, 16, 32, 64],
};

export const appReducer = createReducer(
    initialState,
    
    on(SetSelectedQuestion, (state, { question }) => ({
        ...state,
        selectedQuestion: question,
    })),

    on(SetQuestions, (state, { questions }) => ({
        ...state,
        questions: questions,
    })),

    on(UpdateQuestion, (state, { question }) => {
        const index = state.questions.findIndex((q) => q.id === question.id);
        const updatedQuestions = [...state.questions];
        if (index >= 0) {
            updatedQuestions[index] = question;
        }
        return {
            ...state,
            questions: updatedQuestions,
        };
    }),

    on(SetEditingQuestion, (state, { editingQuestion }) => ({
        ...state,
        editingQuestion: editingQuestion,
    })),

    on(AddQuestion, (state, { question }) => ({
        ...state,
        questions: [...state.questions, question],
    })),

    on(SetQuestionIntervals, (state, { intervals }) => ({
        ...state,
        questionIntervals: intervals,
    })),

    on(UpdateQuestionIntervals, (state, { intervals }) => ({
        ...state,
        questionIntervals: intervals,
    }))
);
