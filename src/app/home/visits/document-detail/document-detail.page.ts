import { Component, inject, OnInit, DestroyRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonNavLink, IonBackButton, IonButtons, IonIcon, IonFooter, IonAvatar } from '@ionic/angular/standalone';
import { PricePage } from '../../price/price.page';
import {
  caretBack, closeOutline, checkmarkOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.page.html',
  styleUrls: ['./document-detail.page.scss'],
  standalone: true,
  imports: [IonIcon, IonAvatar, IonFooter,  IonButtons, IonBackButton, IonNavLink, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DocumentDetailPage  {
  priceDetail = PricePage;
  constructor() {
    addIcons({closeOutline,checkmarkOutline,caretBack});
    console.log("CREATE DETAIL");
  }
}
