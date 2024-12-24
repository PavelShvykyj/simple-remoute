import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { IndexedDBService } from '../services/db-indexed.service';
import * as GoodsActions from './goods.actions';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';
import { FireDBService } from '../services/db-firebase.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class GoodsEffects {
  private actions$: Actions = inject(Actions);
  private firebaseDBService: FireDBService = inject(FireDBService);
  private indexedDBService: IndexedDBService = inject(IndexedDBService);
  private notificator: NotificationService = inject(NotificationService);

  syncGoods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GoodsActions.syncGoods),
      switchMap(() =>
        from(this.indexedDBService.getLastSync()).pipe(
          switchMap((lastSync) =>
            this.firebaseDBService.GoodsToSync((lastSync ? parseInt(lastSync) : 0))
              .pipe(
                take(1),
                map((goods) => ({ goods, lastSync: Date.now() }))
              )
          ),
          catchError((error,lastSync)=> {
            this.notificator.NotificateError("error on get goods from cloud");
            console.error('error on get goods from cloud', error);
            return of({goods: [], lastSync})
          })
        ),
      ),
      mergeMap(({ goods, lastSync }) =>
        from(this.indexedDBService.updateGoods(goods)).pipe(
          switchMap(() => from(this.indexedDBService.setLastSync(lastSync.toString()))),
          map(() => GoodsActions.syncGoodsSuccess({ goods })),
          catchError((error) => {
            this.notificator.NotificateError('error on sync goods effect');
            console.error('error on sync goods effect', error);
            return of(GoodsActions.syncGoodsFailure({ error: error.message }));
          }
          )
        )
      )
    )
  );

  loadGoods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GoodsActions.syncGoodsSuccess),
      switchMap(() => from(this.indexedDBService.getGoods())),
      map((loaded) => GoodsActions.loadGoods({goods: loaded}))));
};
