import {
  Component,
  inject,
  Input,
  input,
  OnInit,
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
  NavParams,
  ModalController,
  ActionSheetController, IonToggle } from '@ionic/angular/standalone';
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
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  selectCurrentFolderID,
  selectFolderTree,
  selectGoodsByFolder,
  selectGoodsByIds,
  selectGoodsByNamePartial,
  selectSearchValue,
} from 'src/app/state/goods.selectors';
import { switchMap, combineLatest, of } from 'rxjs';
import { EditItemComponent } from 'src/app/components/edit-item/edit-item.component';

@Component({
  selector: 'app-price',
  templateUrl: './price.page.html',
  styleUrls: ['./price.page.scss'],
  standalone: true,
  imports: [IonToggle,
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
export class PricePage  {
  private store = inject(Store);
  private actionSheetCtrl = inject(ActionSheetController);
  public modalController = inject(ModalController);
  nav = inject(NavController);
  //navParams = inject(NavParams);
  goodsView: WritableSignal<Good[]> = signal([]);
  folderTree: WritableSignal<Good[]> = signal([]);
  @Input() showFooter = false;
  @Input()
  set selectedOnly(value: boolean) {
    this.showSelectedOnly.set(value)
  }

  @Input()
  set goodsToSelect(value: Record<string, DocumentRecordGood>) {
    this.selectedGoods = {...value}
  }

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
      [
        this.store.pipe(select(selectCurrentFolderID)),
        this.store.pipe(select(selectSearchValue)),
        toObservable(this.showSelectedOnly)
      ]
    ).pipe(
      switchMap(viewParametrs => {
          const curretFolder = viewParametrs[0];
          const partialName = viewParametrs[1];
          const onlySelected = viewParametrs[2];
          const selectedIds = Object.keys(this.selectedGoods);
          if (onlySelected && selectedIds.length > 0) {
            return this.store.pipe(select(selectGoodsByIds(selectedIds)))
          }

          if (partialName.length === 0) {
            return this.store.pipe(select(selectGoodsByFolder(curretFolder)))
          }

          if (partialName.length !== 0){
            return this.store.pipe(select(selectGoodsByNamePartial(partialName)))
          }

          return of([])
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

  onGoodSelect(good: Good) {
    this.selectedGoods[good.id] =
      {
        docId: undefined,
        id: good.id,
        quontity: 1,
        price: good.price,
        total: good.price ?? 0
      }
      this.onQuontityClick(1, good.id, good.name);
  }

  async onShowActions() {
    const actionSheet = await this.actionSheetCtrl.create(this.actions);
    await actionSheet.present();
  }

  onActionClick(action: string) {
    switch (action) {
      case 'CREATE':
        this.nav.navigateForward(['/home/visitdetail', ''], { state: {goods: {...this.selectedGoods}}});
        this.selectedGoods = {};
        break;
      case 'CHANGE_SHOW_SELECTED':
        this.showSelectedOnly.set(!this.showSelectedOnly())
        break;
      default:
        break;
    }
  }

  onQuontityClick(quontity: number, id: string, name: string) {
    this.modalController.create({
      component: EditItemComponent,
      componentProps: {
        'item': {
          quontity: quontity,
          id: id,
          name: name
        }
      }
    }).then(modalEl => {
      modalEl.onWillDismiss().then(result =>
        {
          if (!result.data.canseled) {
            if (result.data.quontity === 0 ) {
              delete this.selectedGoods[result.data.id];
            } else {
              this.selectedGoods[result.data.id].quontity = result.data.quontity;
            }
          }
        });
      modalEl.present();
    })
  }

  Save() {
    this.modalController.dismiss({
      canseled: false,
      goods: this.selectedGoods
    });
  }

  Cancel() {
    this.modalController.dismiss({
      canseled: true
    });
  }
}
