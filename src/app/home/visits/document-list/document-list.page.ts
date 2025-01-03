import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonNav, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonNavLink, IonButton, IonAvatar, IonFooter, IonIcon, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonGrid, IonRow, IonCol, IonList, IonNote, IonAlert } from '@ionic/angular/standalone';

import {
  caretBack, closeOutline, checkmarkOutline, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { DocumentDetailPage } from '../document-detail/document-detail.page';
import { IndexedDBService } from '../../../services/db-indexed.service';
import { select, Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Visit } from 'src/app/models/visit.model';
import { selectAllVisits } from 'src/app/state/documents/doc.selectors';
import * as DocActions from '../../../state/documents/doc.actions'

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.page.html',
  styleUrls: ['./document-list.page.scss'],
  standalone: true,
  imports: [DatePipe, IonNote, IonList, IonCol, IonRow, IonGrid, IonItem, IonLabel, IonIcon, IonFooter, IonAvatar, IonButton, IonNavLink, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DocumentListPage  {
  cachService = inject(IndexedDBService);
  documentDetail = DocumentDetailPage;
  private store = inject(Store);
  alertController =  inject(AlertController);
  visitsView: WritableSignal<Visit[]> = signal([]);
  nav = inject(IonNav);
  constructor() {
    addIcons({closeOutline,checkmarkOutline,caretBack, trash});

    this.store.pipe(select(selectAllVisits),takeUntilDestroyed()).subscribe(reult => this.visitsView.set(reult))
  }

  async onVisitDelete(visit: Visit) {
    const alert = await this.alertController.create({
      header: 'Deletion',
      message: `Are you sure you want to remove ${visit.street}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: () => this.store.dispatch(DocActions.deleteVisit({id: visit.id})),
        },
      ],
    });

    await alert.present();
  }

}
