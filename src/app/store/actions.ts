import { createAction, props } from '@ngrx/store';
import { Question } from '../model/IQuestion';

// Set selected question
export const SetSelectedQuestion = createAction(
  '[Question] Set Selected Question',
  props<{ question: Question }>()
);

// Set questions list
export const SetQuestions = createAction(
  '[Question] Set Questions',
  props<{ questions: Question[] }>()
);

// Update a single question
export const UpdateQuestion = createAction(
  '[Question] Update Question',
  props<{ question: Question }>()
);

// Set editing mode for a question
export const SetEditingQuestion = createAction(
  '[Question] Set Editing Question',
  props<{ editingQuestion: boolean }>()
);

// Add a new question
export const AddQuestion = createAction(
  '[Question] Add Question',
  props<{ question: Question }>()
);

// Set question intervals
export const SetQuestionIntervals = createAction(
  '[Question] Set Question Intervals',
  props<{ intervals: number[] }>()
);

// Set question intervals success
export const SetQuestionIntervalsSuccess = createAction(
  '[Question] Set Question Intervals Success',
  props<{ intervals: number[] }>()
);

// Set question intervals failure
export const SetQuestionIntervalsFailed = createAction(
  '[Question] Set Question Intervals Failed',
  props<{ error: any }>()
);

// Update question intervals
export const UpdateQuestionIntervals = createAction(
  '[Question] Update Question Intervals',
  props<{ intervals: number[] }>()
);
