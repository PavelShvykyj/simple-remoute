import { createAction, props } from '@ngrx/store';
import { Visit } from 'src/app/models/visit.model';
import { DocumentRecordGood } from 'src/app/models/good-model';
import { Update } from '@ngrx/entity';

export const loadVisits = createAction('[Docs] Load Visits', props<{ headers: Visit[], goods: DocumentRecordGood[] }>());
export const addVisit = createAction('[Docs] Add visit to cloud', props<{ visit: Visit, goods: DocumentRecordGood[] }>());
export const addVisitSucces = createAction('[Docs] Add visit to statte', props<{ visit: Visit, goods: DocumentRecordGood[] }>());
export const addVisitFailure = createAction('[Docs] Add visit to statte fail');


export const addVisitGoods = createAction('[Docs] Add visit goods to cloud', props<{ goods: DocumentRecordGood[] }>());
export const addVisitGoodsSucces = createAction('[Docs] Add visit goods to state', props<{ goods: DocumentRecordGood[] }>());

export const updateVisit = createAction('[Docs] Update Visit in cloud', props<{ visit: Update<Visit>}>());
export const updateVisitSucces = createAction('[Docs] Update Visit in state', props<{ visit: Update<Visit>}>());

export const deleteVisit = createAction('[Docs] Delete Visit in cloud', props<{ id: string }>());
export const deleteVisitSucces = createAction('[Docs] Delete Visit in state', props<{ id: string }>());
export const deleteVisitFailure = createAction('[Docs] Delete Visit in state fail');



export const updateVisitGoods = createAction('[Docs] Update Visit Goods in cloud', props<{ goods: Update<DocumentRecordGood>[]}>());
export const updateVisitGoodsSucces = createAction('[Docs] Update Visit Goods in state', props<{ goods: Update<DocumentRecordGood>[]}>());

export const syncVisits = createAction('[Docs] Sync Visits');
export const syncVisitsSuccess = createAction('[Docs] Sync Goods Success', props<{ headers: Visit[], goods: DocumentRecordGood[] }>());
export const syncVisitsFailure = createAction('[Docs] Sync Goods Failure', props<{ error: string }>());

export const setVisitOnEdit = createAction('[Docs] Set Visit on edit', props<{ id: string }>());
