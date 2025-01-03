import { Component, inject, OnInit, DestroyRef, ViewContainerRef, Signal, output, input, Input, AfterViewInit, WritableSignal, signal, effect, Inject, viewChild } from '@angular/core';
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
  IonRow, IonModal, IonList, IonItem, IonLabel, ModalController, NavController, IonNav } from '@ionic/angular/standalone';
import { PricePage } from '../../price/price.page';
import {
  caretBack, closeOutline, checkmarkOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { AddressAutocompleteComponent } from 'src/app/components/address-autocomplete/address-autocomplete.component';
import { DocumentRecordGood } from 'src/app/models/good-model';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { selectVisitOnEditId, selectVisitWithGoods } from 'src/app/state/documents/doc.selectors';
import { FormVisit, Visit } from 'src/app/models/visit.model';
import { DEFOULT_REGION } from 'src/app/constants/defoult.values';
import * as DocsActions from '../../../state/documents/doc.actions';
import { Address } from 'src/app/models/address.model';
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
  navCtrl = inject(NavController);
  router = inject(Router);
  parametrGoods: Record<string, DocumentRecordGood> = {}
  backbtn: Signal<IonBackButton | undefined> = viewChild(IonBackButton);
  destroyRef$ = inject(DestroyRef);
  private store = inject(Store);
  public modalController = inject(ModalController);
  documentHeaderForm = new FormGroup({
    id: new FormControl('', { nonNullable: true }),
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
        // let total = 0;
        // keys.forEach(key => {
        //   total = total + goods[key].quontity*(goods[key].price ?? 0)
        // })

        return keys.length }))
    , { initialValue: 0 });


  currentViist: WritableSignal<FormVisit | undefined> = signal(undefined) ;


  @Input() nav : IonNav | undefined;
  @Input()
  set id(value: string) {
    this.store.dispatch(DocsActions.setVisitOnEdit({id: value}));
  };

  constructor() {
    this.store.pipe(
      select(selectVisitOnEditId),
      switchMap((id)=> {return this.store.pipe(select(selectVisitWithGoods(id)))}),
      takeUntilDestroyed()
    ).subscribe(res => {
      if (res) {
        this.currentViist.set({...res})
      }
    })

    addIcons({closeOutline,checkmarkOutline,caretBack});
    effect(()=> {
      this.FillFormBySavedValue(this.currentViist())
    })
  }

  ionViewDidLeave() {
    this.store.dispatch(DocsActions.setVisitOnEdit({id: ''}));
  }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const navigationState = navigation?.extras.state;
    if (navigationState) {
      this.parametrGoods = navigationState['goods'];
    }
  }

  onSelectionChange(event: Record<string, DocumentRecordGood>) {
    this.documentHeaderForm.get('goods')?.setValue(event);
  }

  onReject() {
    this.goBack();
  }

  onConfirm() {
    const formValue = this.documentHeaderForm.value;
    const formAddress: Address =  this.documentHeaderForm.get('visitAddress')!.value;

    const visit: Visit  = {
      docDate: formValue.docDate!,
      id: formValue.id!,
      comment: formValue.comment!,
      contract: formValue.contract!,
      street: formAddress!.street,
      confirmedStreet: formAddress.confirmedStreet,
      house: formAddress.house,
      flat: formAddress.flat
    };

    const goods: DocumentRecordGood[] = []
    if(formValue.goods) {
      const keys = Object.keys(formValue.goods);
      keys.forEach(key => {
        goods.push(formValue.goods![key])
      })
    }

    this.store.dispatch(DocsActions.addVisit({visit , goods}));

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

  FillFormBySavedValue(value: FormVisit | undefined) {
    if (!value) {
      this.documentHeaderForm.reset();
      this.onSelectionChange(this.parametrGoods);
      this.parametrGoods = {};
      return;
    }

    const formated = {
      id: value.id,
      comment: value.comment,
      docDate: value.docDate,
      contract: value.contract,
      goods: value.goods,
      visitAddress: {
        country: DEFOULT_REGION.country,
        region: DEFOULT_REGION.region,
        city: DEFOULT_REGION.city,
        street: value.street,
        confirmedStreet: value.confirmedStreet,
        house: value.house,
        flat: value.flat,
      }
    }

    this.documentHeaderForm.reset(formated);

  }

  goBack() {
    if (!!this.nav) {
      this.nav.pop()
    } else {
      this.navCtrl.back();
    }
  }
}
