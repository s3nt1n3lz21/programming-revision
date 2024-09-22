import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { LoggerService, LogLevel } from 'src/app/services/logger.service';
import { SetQuestionIntervals, SetQuestionIntervalsSuccess, SetQuestionIntervalsFailed } from './actions';

@Injectable()
export class QuestionEffects {
  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private logger: LoggerService
  ) {}

  updateIntervals$ = createEffect(() =>
    this.actions$.pipe(
      // Listen for the SetQuestionIntervals action using ofType
      ofType(SetQuestionIntervals),
      mergeMap(({ intervals }) =>
        this.apiService.updateQuestionIntervals(intervals).pipe(
          // On success, dispatch SetQuestionIntervalsSuccess
          map(() => SetQuestionIntervalsSuccess({ intervals })),
          // On failure, dispatch SetQuestionIntervalsFailed
          catchError((error) => {
            this.logger.log(LogLevel.ERROR, 'QuestionEffects', 'Error updating intervals', error);
            return of(SetQuestionIntervalsFailed({ error }));
          })
        )
      )
    )
  );
}
