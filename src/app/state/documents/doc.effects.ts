import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IndexedDBService } from '../../services/db-indexed.service';
import * as DocsActions from './doc.actions';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { FireDBService } from '../../services/db-firebase.service';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class DocsEffects {
  private actions$: Actions = inject(Actions);
  private firebaseDBService: FireDBService = inject(FireDBService);
  private indexedDBService: IndexedDBService = inject(IndexedDBService);
  private notificator: NotificationService = inject(NotificationService);

  syncVisits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocsActions.syncVisits),
      switchMap(() =>
        from(this.indexedDBService.getLastSync()).pipe(
          switchMap((lastSync) =>
            this.firebaseDBService
              .VisitsToSync(lastSync ? parseInt(lastSync) : 0)
              .pipe(take(1))
          ),
          catchError((error, lastSync) => {
            this.notificator.NotificateError('error on get visits from cloud');
            console.error('error on get visits from cloud', error);
            return of({ goods: [], headers: [] });
          })
        )
      ),
      map((result) =>
        DocsActions.syncVisitsSuccess({
          goods: result.goods,
          headers: result.headers,
        })
      )
    )
  );

  loadVisits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocsActions.syncVisitsSuccess),
      map((props) =>
        DocsActions.loadVisits({ goods: props.goods, headers: props.headers })
      )
    )
  );

  addVisit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocsActions.addVisit),
      switchMap((actionResult) => this.firebaseDBService.AddVisit(actionResult).pipe(take(1))),
      catchError((error) => {
        this.notificator.NotificateError('error on add visit to cloud');
        console.error('error on get visits from cloud', error);
        return of(undefined);
      }),
      map((actionResult) => {
        if (actionResult) {
          this.notificator.NotificateSuccess('Visit is saved')
          return DocsActions.addVisitSucces(actionResult)
        }
        return DocsActions.addVisitFailure
      })
    )
  );

  removeVisit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DocsActions.deleteVisit),
      switchMap((actionResult) => this.firebaseDBService.RemoveVisit(actionResult.id).pipe(take(1))),
      catchError((error) => {
        this.notificator.NotificateError('error on remove visit to cloud');
        console.error('error on get visits from cloud', error);
        return of(undefined);
      }),
      map((actionResult) => {
        if (actionResult) {
          this.notificator.NotificateSuccess('Visit is removed')
          return DocsActions.deleteVisitSucces(actionResult)
        }
        return DocsActions.deleteVisitFailure
      })
    )
  );

}
