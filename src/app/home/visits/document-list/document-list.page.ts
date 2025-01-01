import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonNavLink, IonButton, IonAvatar, IonFooter, IonIcon, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';

import {
  caretBack, closeOutline, checkmarkOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { DocumentDetailPage } from '../document-detail/document-detail.page';
import { IndexedDBService } from '../../../services/db-indexed.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.page.html',
  styleUrls: ['./document-list.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonLabel, IonIcon, IonFooter, IonAvatar, IonButton, IonNavLink, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DocumentListPage  {
  cachService = inject(IndexedDBService);
 documentDetail = DocumentDetailPage;

  constructor() {
    addIcons({closeOutline,checkmarkOutline,caretBack});
  }



}
