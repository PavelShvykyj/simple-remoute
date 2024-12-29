import { Component, inject, OnInit, DestroyRef, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonNavLink,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonFooter,
  IonAvatar,
  IonCol,
  IonGrid,
  IonRow } from '@ionic/angular/standalone';
import { PricePage } from '../../price/price.page';
import {
  caretBack, closeOutline, checkmarkOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AddressAutocompleteComponent } from 'src/app/components/address-autocomplete/address-autocomplete.component';
@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.page.html',
  styleUrls: ['./document-detail.page.scss'],
  standalone: true,
  imports: [
    IonRow,
    IonGrid,
    IonCol,
    IonIcon,
    IonAvatar,
    IonFooter,
    IonButtons,
    IonInput,
    IonBackButton,
    IonNavLink,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AddressAutocompleteComponent]
})
export class DocumentDetailPage  {
  priceDetail = PricePage;
  documentHeaderForm = new FormGroup({
    comment: new FormControl('', { nonNullable: true }),
    docDate: new FormControl(new Date(), { nonNullable: true })
  })

  constructor() {
    addIcons({closeOutline,checkmarkOutline,caretBack});
  }
}
