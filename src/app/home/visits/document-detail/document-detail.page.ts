import { Component, inject, OnInit, DestroyRef, ViewContainerRef, Signal, output } from '@angular/core';
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
  IonRow, IonModal, IonList, IonItem, IonLabel, ModalController, NavController } from '@ionic/angular/standalone';
import { PricePage } from '../../price/price.page';
import {
  caretBack, closeOutline, checkmarkOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AddressAutocompleteComponent } from 'src/app/components/address-autocomplete/address-autocomplete.component';
import { DocumentRecordGood } from 'src/app/models/good-model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.page.html',
  styleUrls: ['./document-detail.page.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonItem,
    IonRow,
    IonGrid,
    IonCol,
    IonIcon,
    IonAvatar,
    IonFooter,
    IonButtons,
    IonInput,
    IonBackButton,
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
export class DocumentDetailPage implements OnInit {
  priceDetail = PricePage;
  nav = inject(NavController);
  router = inject(Router);
  public modalController = inject(ModalController);
  documentHeaderForm = new FormGroup({
    comment: new FormControl('', { nonNullable: true }),
    docDate: new FormControl(new Date(), { nonNullable: true }),
    contract: new FormControl('', { nonNullable: true }),
    goods: new FormControl<Record<string, DocumentRecordGood>>({}, { nonNullable: true }),
  })

  goodsTotal: Signal<number> = toSignal(
    this.documentHeaderForm.get('goods')!
    .valueChanges.pipe(
      map(goods => {
        const keys = Object.keys(goods);
        let total = 0;
        keys.forEach(key => {
          total = total + goods[key].quontity*(goods[key].price ?? 0)
        })

        return total }))
    , { initialValue: 0 });

  constructor() {
    addIcons({closeOutline,checkmarkOutline,caretBack});
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;
    if (state) {
      const parametrGoods = state['goods'];
      if (parametrGoods) {
        this.onSelectionChange(parametrGoods);
      }
    }
  }

  onSelectionChange(event: Record<string, DocumentRecordGood>) {
    this.documentHeaderForm.get('goods')?.setValue(event);
  }

  onReject() {
    this.nav.navigateBack('home/price');
  }

  onConfirm() {
    this.nav.navigateBack('home/price');
  }

  openSelectGoods() {
        this.modalController.create({
          component: PricePage,
          componentProps: {
            showFooter: true,
            goodsToSelect: this.documentHeaderForm.get('goods')?.value,
            selectedOnly: Object.keys(this.documentHeaderForm.get('goods')!.value).length > 0
          }
        }).then(modalEl => {
          modalEl.onWillDismiss().then(result =>
            {
              if (!result.data.canseled) {
                if (result.data.goods) {
                  this.onSelectionChange(result.data.goods);
                }
              }
            });
          modalEl.present();
        })
  }
}
