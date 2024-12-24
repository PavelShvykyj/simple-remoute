import { createFeatureSelector, createSelector } from '@ngrx/store';
import { goodsAdapter, GoodsState } from './goods.reducer';
import { Good } from '../models/good-model';

export const selectGoodsState = createFeatureSelector<GoodsState>('goods');
export const { selectAll, selectEntities } = goodsAdapter.getSelectors();
export const selectAllGoods = createSelector(selectGoodsState, selectAll);
export const selectGoodsEntities = createSelector(selectGoodsState, selectEntities);;
export const selectCurrentFolderID = createSelector(
  selectGoodsState,
  (state) => state.currentFolder
);

export const selectCurrentFolder = createSelector(
  selectGoodsEntities,
  selectCurrentFolderID,
  (entities, selectedId) => (selectedId ? entities[selectedId] : '')
);

export const selectFolderTree = (id: string) =>
  createSelector(selectGoodsEntities, (goodsDictionary) => {
    let folderTree: Good[] = [];
    if (id === '') {
      return folderTree;
    }
    let parentID = id;
    while (parentID !== '') {
      const currentParent = goodsDictionary[parentID];
      if (currentParent) {
        folderTree = [currentParent, ...folderTree];
        //folderTree.push(currentParent);
        parentID = currentParent.parentid;
      } else {
        parentID === '';
      }
    }
    return folderTree;
  });

export const selectIsLoaded = createSelector(selectGoodsState, (state) => {
  return state.isLoaded;
});

export const selectGoodsByFolder = (parentId: string) =>
  createSelector(selectAllGoods, (goods) => {
    return goods.filter((good) => good.parentid === parentId);
  });

export const selectGoodsByNamePartial = (searchBy: string) => {
  createSelector(selectAllGoods, (goods) =>
    goods.filter((good) => good.normalizedName.search(searchBy))
  );
};
