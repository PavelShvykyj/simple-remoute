import { inject, Injectable } from '@angular/core';
import {
  Database,
  ref,
  query,
  orderByChild,
  startAfter,
  listVal,
} from '@angular/fire/database';
import { map, Observable } from 'rxjs';
import { Good } from '../models/good-model';
import { search } from 'ionicons/icons';

@Injectable({
  providedIn: 'root',
})
export class FireDBService {
  fdb = inject(Database);
  goodsRef = ref(this.fdb, 'goods');

  GoodsToSync(lastSync: number): Observable<Good[]> {
    const querySync = query(
      this.goodsRef,
      orderByChild('updatedAt'),
      startAfter(lastSync)
    );
    return listVal<Good>(querySync).pipe(
      map((goods) => {
        const goodsMaped = goods.map((el) => {
          return {
            ...el,
            normalizedName: el.name.toUpperCase().replace(/\s/g, ''),
          };
        });
        return goodsMaped;
      })
    );
  }
}
