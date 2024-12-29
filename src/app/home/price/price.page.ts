import {
  Component,
  inject,
  input,
  output,
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
  IonNote,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonBreadcrumb,
  IonBreadcrumbs,
  IonSearchbar,
  IonButtons,
  IonBackButton,
  IonFooter,
  IonButton,
  IonCheckbox,
  IonBadge,
  IonFabButton,
  IonFab,
  NavController,
  ActionSheetController } from '@ionic/angular/standalone';
import {
  folder,
  caretBack,
  remove,
  closeOutline,
  checkmarkOutline,
  home,
  searchOutline,
  chevronBackOutline,
  homeOutline,
  chevronForwardCircleOutline,
  chevronForwardOutline,
  keypadOutline,
  ellipsisVertical,
  toggleOutline,
  createOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { select, Store } from '@ngrx/store';
import { DocumentRecordGood, Good } from 'src/app/models/good-model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  selectCurrentFolderID,
  selectFolderTree,
  selectGoodsByFolder,
  selectGoodsByNamePartial,
  selectSearchValue,
} from 'src/app/state/goods.selectors';
import { switchMap, combineLatest } from 'rxjs';

@Component({
  selector: 'app-price',
  templateUrl: './price.page.html',
  styleUrls: ['./price.page.scss'],
  standalone: true,
  imports: [
    IonFab,
    IonFabButton,
    IonBadge,
    IonCheckbox,
    IonButton,
    IonFooter,
    IonBackButton,
    IonButtons,
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
    IonBreadcrumb
  ],
})
export class PricePage {
  private store = inject(Store);
  private actionSheetCtrl = inject(ActionSheetController);
  nav = inject(NavController);
  goodsView: WritableSignal<Good[]> = signal([]);
  folderTree: WritableSignal<Good[]> = signal([]);
  showFooter = input<boolean>(false);
  selectionCancel = output();
  selectionChange = output<Record<string, DocumentRecordGood>>();
  selectedGoods: Record<string, DocumentRecordGood> = {};
  showSelectedOnly = signal(false);
  actions = {
    header: 'Choose action :',

    buttons: [
      {
        text: 'Create new visit',
        icon: 'create-outline',
        handler:
          () => { this.onActionClick('CREATE') }
      },

      {
        text: 'Toggle show selected',
        icon: 'toggle-outline',
        handler:
          () => { this.onActionClick('CHANGE_SHOW_SELECTED') }
      },
    ]
  }

  constructor() {
    addIcons({createOutline, toggleOutline, home, ellipsisVertical, chevronForwardOutline,folder,keypadOutline,closeOutline,checkmarkOutline,caretBack,searchOutline,chevronBackOutline,chevronForwardCircleOutline,homeOutline,remove});

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



  onNameFilterInput(value?: string | null) {
    this.store.dispatch(GoodsActions.selectSearchValue({value: value ?? ''}))
  }

  onSelectionConfirm() {
    this.selectionChange.emit(this.selectedGoods);
  }

  onGoodSelect(good: Good) {
    this.selectedGoods[good.id] =
      {
        docId: undefined,
        id: good.id,
        quontity: 1,
        price: good.price,
        total: good.price ?? 0
      }
  }

  async onShowActions() {
    const actionSheet = await this.actionSheetCtrl.create(this.actions);
    await actionSheet.present();
  }

  onActionClick(action: string) {
    switch (action) {
      case 'CREATE':
        this.nav.navigateForward(['/home/visitdetail', '']);
        break;
      case 'CHANGE_SHOW_SELECTED':
        this.showSelectedOnly.set(!this.showSelectedOnly())
        break;
      default:
        break;
    }
  }
}
