import { createAction, props } from '@ngrx/store';
import { Good } from '../models/good-model';

export const loadGoods = createAction('[Goods] Load Goods', props<{ goods: Good[] }>());
export const addGoods = createAction('[Goods] Add Goods', props<{ good: Good }>());
export const updateGoods = createAction('[Goods] Update Goods', props<{ goods: Good }>());
export const deleteGoods = createAction('[Goods] Delete Goods', props<{ id: number }>());
export const selectGoods = createAction('[Goods] Select Goods', props<{ id: number }>());
export const syncGoods = createAction('[Goods] Sync Goods');
export const syncGoodsSuccess = createAction('[Goods] Sync Goods Success', props<{ goods: Good[] }>());
export const syncGoodsFailure = createAction('[Goods] Sync Goods Failure', props<{ error: string }>());
