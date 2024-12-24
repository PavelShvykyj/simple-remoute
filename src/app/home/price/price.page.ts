import {
  Component,
  effect,
  inject,
  OnInit,
  Signal,
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
} from '@ionic/angular/standalone';
import {
  folder,
  remove,
  closeOutline,
  checkmarkOutline,
  home,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { select, Store } from '@ngrx/store';
import { Good } from 'src/app/models/good-model';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  selectCurrentFolderID,
  selectFolderTree,
  selectGoodsByFolder,
} from 'src/app/state/goods.selectors';
import { forkJoin, map, switchMap, tap, take } from 'rxjs';
@Component({
  selector: 'app-price',
  templateUrl: './price.page.html',
  styleUrls: ['./price.page.scss'],
  standalone: true,
  imports: [
    IonBreadcrumb,
    IonBreadcrumbs,
    IonButtons,
    IonFooter,
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
    IonListHeader,
    IonNote,
    IonButton,
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
    addIcons({ home, folder, remove, closeOutline, checkmarkOutline });

    this.store
    .pipe(
      select(selectCurrentFolderID),
      switchMap((id) =>
        this.store.pipe(
          select(selectGoodsByFolder(id)),
          switchMap((goods) =>
            this.store.pipe(select(selectFolderTree(id))).pipe(
              map((tree) => ({ goods, tree }))
            )
          )
        )
      ),
      takeUntilDestroyed()
    )
    .subscribe(({ goods, tree }) => {
      this.goodsView.set(goods);
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
}
