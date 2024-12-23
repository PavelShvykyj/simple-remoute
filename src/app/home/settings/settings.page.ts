import { Component, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
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
  IonCol, } from '@ionic/angular/standalone';
import { IndexedDBService } from 'src/app/services/db-indexed.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { IndexedDBMetadata } from 'src/app/models/Indexeddb.metadata';
import * as GoodsActions from '../../state/goods.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [
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
  private  store: Store = inject(Store);
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

  ngOnInit(): void {
    this.getMetadata();
  }

  onClear() {
    this.indexedDBService.clearAllTables().then(() => {
      this.getMetadata();
      this.store.dispatch(GoodsActions.loadGoods({goods: []}));
    });
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
