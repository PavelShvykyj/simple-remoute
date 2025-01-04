import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { DocumentRecordGood } from '../../models/good-model';
import * as VisitActions from './doc.actions';
import { createReducer, on } from '@ngrx/store';
import { Visit } from 'src/app/models/visit.model';

export interface VisitsState extends EntityState<Visit> {
}

export interface VisitGoodsState extends EntityState<DocumentRecordGood> {
}

export interface DocumentsState {
  isLoaded: boolean,
  editedVisitId: string,
  visits: VisitsState,
  visitsGoods: VisitGoodsState
}

export const visitsAdapter: EntityAdapter<Visit> = createEntityAdapter<Visit>({
  sortComparer:  (a, b) => {
    if (a.docDate < b.docDate) return -1;
    if (a.docDate > b.docDate) return 1;
    return 0;
  },
});
export const visitGoodsAdapter: EntityAdapter<DocumentRecordGood> = createEntityAdapter<DocumentRecordGood>({selectId: el => el.cloudId});
export const initialVisitsState: VisitsState = visitsAdapter.getInitialState();
export const initialVisitGoodssState: VisitGoodsState = visitGoodsAdapter.getInitialState();

export const initalState: DocumentsState = {
  isLoaded: false,
  editedVisitId: '',
  visits: initialVisitsState,
  visitsGoods: initialVisitGoodssState
}



export const visitReducer = createReducer(
  initalState,
  on(VisitActions.setVisitOnEdit, (state, {id})=> {return {...state, editedVisitId: id} } ),
  on(VisitActions.loadVisits, (state, { headers, goods, }) => {
    return { ...state,
      visits: visitsAdapter.setAll(headers,state.visits),
      visitsGoods: visitGoodsAdapter.setAll(goods,state.visitsGoods),
      isLoaded: true,
    };
  }),

  on(VisitActions.addVisitSucces, (state, {visit, goods}) => {
    const clearState = removeVisitHelper(visit.id, state);
    return { ...clearState,
      visits: visitsAdapter.addOne(visit,clearState.visits),
      visitsGoods: visitGoodsAdapter.addMany(goods,clearState.visitsGoods),
      editedVisitId: visit.id
    };
  }),

  on(VisitActions.addVisitGoodsSucces, (state, { goods }) =>  {
    return { ...state,
      visitsGoods: visitGoodsAdapter.upsertMany(goods,state.visitsGoods),
    };
  }),
  on(VisitActions.updateVisitSucces, (state, { visit }) => {
    return { ...state,
      visits: visitsAdapter.updateOne(visit,state.visits),
    };
  }),
  on(VisitActions.deleteVisitSucces, (state, { id }) => {
    return removeVisitHelper(id, state);
  }),
  on(VisitActions.updateVisitGoodsSucces, (state, { goods }) => {
    return { ...state,
      visitsGoods: visitGoodsAdapter.updateMany(goods, state.visitsGoods)
    };
  }),


);

function removeVisitHelper(id: string, state: DocumentsState): DocumentsState {
  const visitGoodsIds = state.visitsGoods.ids.filter(gid => {
    return state.visitsGoods.entities[gid]?.docId === id
  }).map(el => el.toString());
  return { ...state,
    visits: visitsAdapter.removeOne(id, state.visits),
    visitsGoods: visitGoodsAdapter.removeMany(visitGoodsIds, state.visitsGoods)
  };
}
