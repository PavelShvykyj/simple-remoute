import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DocumentsState, visitGoodsAdapter, visitsAdapter } from "./doc.reducer";
import { FormVisit } from "src/app/models/visit.model";

export const selectDocsState = createFeatureSelector<DocumentsState>('visits');
export const selectVisitsState = createSelector(selectDocsState, (state)=> state.visits)
export const selectVisitGoodsState = createSelector(selectDocsState, (state)=> state.visitsGoods)
export const visitBaseSelectors = visitsAdapter.getSelectors();
export const visitGoodsBaseSelectors = visitGoodsAdapter.getSelectors();

export const selectAllVisits = createSelector(selectVisitsState, visitBaseSelectors.selectAll);
export const selectVisitsEntities = createSelector(selectVisitsState, visitBaseSelectors.selectEntities);

export const selectAllVisitGoods = createSelector(selectVisitGoodsState, visitGoodsBaseSelectors.selectAll);
export const selectVisitGoodsEntities = createSelector(selectVisitGoodsState, visitGoodsBaseSelectors.selectEntities);

export const selectIsVisitsLoaded = createSelector(selectDocsState, (state) => {
  return state.isLoaded;
});

export const selectVisitWithGoods = (id: string) =>
  createSelector(selectVisitsEntities, selectAllVisitGoods, (visits, visitGoods)=> {
    const visit = visits[id];
    if (!visit) {
      return null
    }
    const result: FormVisit = {
      ...visit,
      goods: {}
    };
    visitGoods.filter(g => g.docId === id).forEach(vg=> {
      result.goods[vg.id] = vg
    })
    return result
  })

  export const selectVisitOnEditId = createSelector(selectDocsState, (state)=> state.editedVisitId);
