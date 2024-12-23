  import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
  import { Good } from '../models/good-model';
  import * as GoodsActions from './goods.actions';
  import { createReducer, on } from '@ngrx/store';

  export interface GoodsState extends EntityState<Good> {
    selectedGoodParentId: number | null;
    isLoaded: boolean
  }

  export const goodsAdapter: EntityAdapter<Good> = createEntityAdapter<Good>({
    sortComparer: (a, b) => {
      // Folders first, then alphabetically by name
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    },
  });

  export const initialGoodsState: GoodsState = goodsAdapter.getInitialState({
    selectedGoodParentId: null,
    isLoaded: false,
  });

  export const goodsReducer = createReducer(
    initialGoodsState,
    on(GoodsActions.loadGoods, (state, { goods }) => {
      const withGoods = goodsAdapter.setAll(goods, state);
      return {...withGoods, isLoaded: true }
    }),
    on(GoodsActions.addGoods, (state, { good }) => goodsAdapter.addOne(good, state)),
    on(GoodsActions.updateGoods, (state, { goods }) => goodsAdapter.updateOne({ id: goods.id, changes: goods }, state)),
    on(GoodsActions.deleteGoods, (state, { id }) => goodsAdapter.removeOne(id, state)),
    on(GoodsActions.selectGoods, (state, { id }) => ({ ...state, selectedGoodsId: id })),
  );
