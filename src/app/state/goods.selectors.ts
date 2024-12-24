  import { createFeatureSelector, createSelector } from '@ngrx/store';
  import { goodsAdapter, GoodsState } from './goods.reducer';

  export const selectGoodsState = createFeatureSelector<GoodsState>('goods');

  const { selectAll, selectEntities } = goodsAdapter.getSelectors(selectGoodsState);

  export const selectAllGoods = selectAll;
  export const selectGoodsEntities = selectEntities;

  export const selectSelectedParentId = createSelector(selectGoodsState, (state) => state.selectedGoodParentId);

  export const selectSelectedGoods = createSelector(
    selectGoodsEntities,
    selectSelectedParentId,
    (entities, selectedId) => (selectedId ? entities[selectedId] : null),
  );

  export const selectIsLoaded = createSelector(
    selectGoodsState,
    (state) => { return  state.isLoaded }
  )
