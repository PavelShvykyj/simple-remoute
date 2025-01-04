import { inject, Injectable } from '@angular/core';
import {
  Database,
  ref,
  get,
  query,
  orderByChild,
  startAfter,
  listVal,
  push,
  update,
  remove,
  ThenableReference,
  DatabaseReference,
  set,
} from '@angular/fire/database';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { ClaudGood, DocumentRecordGood, Good } from '../models/good-model';
import { search } from 'ionicons/icons';
import { CloudVisit, Visit } from '../models/visit.model';

@Injectable({
  providedIn: 'root',
})
export class FireDBService {
  fdb = inject(Database);
  goodsRef = ref(this.fdb, 'goods');
  visitsRef = ref(this.fdb, 'visits');
  visitGoodsRef = ref(this.fdb, 'visitsGoods');

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

  VisitsToSync(lastSync: number) {
    const querySync = query(
      this.visitsRef,
      orderByChild('docDate'),
      startAfter(lastSync)
    );
    return listVal<CloudVisit>(querySync, { keyField: 'id' }).pipe(
      map((claudVisits) => {
        return this.helperMapCloudVisitToStateResult(claudVisits);
      })
    );
  }

  async AddVisit(data: { visit: Visit; goods: DocumentRecordGood[] }) {
    let dataUpdated = {
      visit: { ...data.visit },
      goods: [...data.goods],
    };

    let newVisitRef = ref(this.fdb, `visits/${data.visit.id}`);
    let visitExists =
      data.visit.id.length !== 0 && (await get(newVisitRef)).exists();
    if (!visitExists) {
      newVisitRef = push(this.visitsRef, {...dataUpdated.visit, docDate: dataUpdated.visit.docDate.getTime()});
      dataUpdated.visit.id = newVisitRef.key!;
    } else {
      update(newVisitRef, dataUpdated.visit);
    }

    const newVistGoodsRef = ref(this.fdb, `visits/${newVisitRef.key}/goods`);
    const visitGoodsClaudData: { [key: string]: ClaudGood } = {};
    dataUpdated.goods = dataUpdated.goods.map((good) => {
      const newVisitGoodKey =
        good.cloudId.length > 0 ? good.cloudId : push(newVistGoodsRef).key;

      visitGoodsClaudData[newVisitGoodKey!] = {
        goodId: good.id,
        quontity: good.quontity,
        price: good.price ?? 0,
      };
      return {
        ...good,
        cloudId: newVisitGoodKey!,
        docId: dataUpdated.visit.id,
      };
    });
    return from(set(newVistGoodsRef, visitGoodsClaudData)).pipe(
      map(() => {
        return dataUpdated;
      })
    );
  }

  RemoveVisit(id: string) {
    const visitRef = ref(this.fdb, `visits/${id}`);
    return from(remove(visitRef)).pipe(
      map(() => {
        return { id };
      })
    );
  }

  helperMapCloudVisitToStateResult(claudVisits: CloudVisit[]): {
    headers: Visit[];
    goods: DocumentRecordGood[];
  } {
    const mapped: { headers: Visit[]; goods: DocumentRecordGood[] } = {
      headers: [],
      goods: [],
    };

    claudVisits.forEach((cVisit) => {
      const cGoods = cVisit.goods ? { ...cVisit.goods } : {};
      const visit: Visit = { ...cVisit, docDate: new Date(cVisit.docDate) };
      mapped.headers.push(visit);

      const keys = Object.keys(cGoods);
      keys.forEach((key) => {
        const cGood = cGoods[key];
        mapped.goods.push({
          id: cGood.goodId,
          cloudId: key,
          docId: visit.id,
          quontity: cGood.quontity,
          price: cGood.price,
          total: cGood.price * cGood.quontity,
        });
      });
    });
    return mapped;
  }
}
