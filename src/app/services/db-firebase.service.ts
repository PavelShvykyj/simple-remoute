import { inject, Injectable } from '@angular/core';
import {
  Database,
  ref,
  query,
  orderByChild,
  startAfter,
  listVal,
  push,
  update,
  remove

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

  AddVisit(data: { visit: Visit, goods: DocumentRecordGood[] }) {
    if (data.visit.id.length !== 0) {
      // ? block to change existing so far
      return of(data);
    }


    let dataUpdated = {
      visit: {...data.visit},
      goods: [...data.goods]
    }
    const newVisitRef = push(this.visitsRef,dataUpdated.visit);
    const newVistGoodsRef = ref(this.fdb,`visits/${newVisitRef.key}/goods`);
    dataUpdated.visit.id = newVisitRef.key!;
    const visitGoodsClaudData: { [key: string]: ClaudGood } = {};
    dataUpdated.goods = dataUpdated.goods.map(good => {
      const newVisitGoodKey = push(newVistGoodsRef).key;

      visitGoodsClaudData[newVisitGoodKey!] = {
        goodId: good.id,
        quontity: good.quontity,
        price: good.price ?? 0
      }
      return {...good, cloudId: newVisitGoodKey!, docId: dataUpdated.visit.id } })
    return from(update(newVistGoodsRef, visitGoodsClaudData)).pipe(map(()=> {return dataUpdated}))
  }

  RemoveVisit(id: string) {
    const visitRef = ref(this.fdb,`visits/${id}`);
    return from(remove(visitRef)).pipe(map(()=> {return {id}}))
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
