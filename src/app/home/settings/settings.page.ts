import { Component, DestroyRef, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonAlert,
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
  IonIcon } from '@ionic/angular/standalone';
import {
  chevronDownCircle,
  closeCircle

} from 'ionicons/icons';
import { IndexedDBService } from 'src/app/services/db-indexed.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { IndexedDBMetadata } from 'src/app/models/Indexeddb.metadata';
import * as GoodsActions from '../../state/goods.actions';
import { select, Store } from '@ngrx/store';
import { selectIsLoaded } from 'src/app/state/goods.selectors';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonIcon,
    DatePipe,
    IonAlert,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonAvatar,
    IonList,
    IonListHeader,
    IonNote
  ],
})
export class SettingsPage implements OnInit {

  private indexedDBService: IndexedDBService = inject(IndexedDBService);
  private store: Store = inject(Store);
  private destroyref$: DestroyRef = inject(DestroyRef);
  isLoaded: WritableSignal<boolean> = signal(false);
  metadata: WritableSignal<IndexedDBMetadata> = signal({
    goodsTotal: 0,
    lastSync: new Date(),
  });
  clearAlertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.onClear();
      },
    },
  ];

  constructor() {
    addIcons({
      chevronDownCircle,
      closeCircle,
    });
  }

  ngOnInit(): void {
    this.store.pipe(
      select(selectIsLoaded),
      takeUntilDestroyed(this.destroyref$))
    .subscribe(isLoaded => {
      this.isLoaded.set(isLoaded);
      this.getMetadata();
    });

  }

  async onClear() {
    await this.indexedDBService.clearAllTables();
    this.getMetadata();
    this.store.dispatch(GoodsActions.loadGoods({goods: []}));
  }

  onRefresh() {
    this.store.dispatch(GoodsActions.syncGoods());
  }

  getMetadata() {
    this.indexedDBService.getMetadata().subscribe(res => {
      this.metadata.set(res);
    });
  }
}
