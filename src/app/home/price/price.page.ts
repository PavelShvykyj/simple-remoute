import {
  Component,
  inject,
  signal,
  WritableSignal,
} from '@angular/core';
import * as GoodsActions from '../../state/goods.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonFooter,
  IonButtons,
  IonBreadcrumb,
  IonBreadcrumbs,
  IonSearchbar, IonFab, IonFabButton } from '@ionic/angular/standalone';
import {
  folder,
  remove,
  closeOutline,
  checkmarkOutline,
  home,
  searchOutline,
  chevronBackOutline,
  homeOutline,
  chevronForwardCircleOutline,
  chevronForwardOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { select, Store } from '@ngrx/store';
import { Good } from 'src/app/models/good-model';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  selectCurrentFolderID,
  selectFolderTree,
  selectGoodsByFolder,
  selectGoodsByNamePartial,
  selectSearchValue,
} from 'src/app/state/goods.selectors';
import { forkJoin, map, switchMap, tap, take, filter, combineLatest } from 'rxjs';
@Component({
  selector: 'app-price',
  templateUrl: './price.page.html',
  styleUrls: ['./price.page.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonBreadcrumb,
    IonBreadcrumbs,
    IonIcon,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonAvatar,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonGrid,
    IonRow,
    IonCol,
    IonBreadcrumb,
  ],
})
export class PricePage {
  private store = inject(Store);
  goodsView: WritableSignal<Good[]> = signal([]);
  folderTree: WritableSignal<Good[]> = signal([]);


  constructor() {
    addIcons({home,chevronForwardOutline,searchOutline,chevronBackOutline,chevronForwardCircleOutline,homeOutline,folder,remove,closeOutline,checkmarkOutline});

    // ? display goods
    combineLatest(
      [this.store.pipe(select(selectCurrentFolderID)),
      this.store.pipe(select(selectSearchValue))]
    ).pipe(
      switchMap(viewParametrs => {
          const partialName = viewParametrs[1];
          const curretFolder = viewParametrs[0];
          if (partialName.length === 0) {
            return this.store.pipe(select(selectGoodsByFolder(curretFolder)))
          } else {
            return this.store.pipe(select(selectGoodsByNamePartial(partialName)))
          }
      }),
      takeUntilDestroyed()
    )
    .subscribe((goods) => {
      this.goodsView.set(goods);
    });

    // ? display folder tree
    this.store
    .pipe(
      select(selectCurrentFolderID),
      switchMap((id) =>
        this.store.pipe(
          select(selectFolderTree(id))
        )
      ),
      takeUntilDestroyed()
    )
    .subscribe((tree ) => {
      this.folderTree.set(tree);
    });
  }

  onGoodClick(good: Good) {
    if (good.isFolder) {
      this.store.dispatch(GoodsActions.selectFolder({ id: good.id }));
    }
  }
  onHeaderFolderClick(id: string) {
    this.store.dispatch(GoodsActions.selectFolder({ id }));
  }



  OnNameFilterInput(value?: string | null) {
    this.store.dispatch(GoodsActions.selectSearchValue({value: value ?? ''}))
  }
}
