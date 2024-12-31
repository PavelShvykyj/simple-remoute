import { Component, inject, input, OnInit, signal, viewChild } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonFooter,
  IonButtons,
  IonAvatar,
  IonIcon,
  ModalController,
  NavParams
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';

export interface DataOnEdit {
  id: string,
  name: string,
  quontity: number
}

@Component({
  selector: 'app-edit-item',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonFooter,
    IonButtons,
    IonAvatar,
  ],
  standalone: true,
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  focusOnEnterElement = viewChild<IonInput>('focusOnEnter');
  editedData = signal<DataOnEdit>({quontity: 0, id: '', name: ''});
  navParams = inject(NavParams);

  minus: number = 1;
  form = new FormGroup({
    "quontity" : new FormControl(1 , { nonNullable: true, validators: Validators.required}),

  });
  public modalController = inject(ModalController);

  constructor() {
    addIcons({ closeOutline, checkmarkOutline });
  }

  ngOnInit(): void {
    this.editedData.set(this.navParams.get('item'))
    this.form.get('quontity')?.setValue(this.editedData().quontity);
  };

  ionViewDidEnter() {
    const input = this.focusOnEnterElement();
    if (input) {
      input.setFocus()
    }
  }

  Save() {
    this.modalController.dismiss({
      canseled: false,
      quontity: this.form.get('quontity')?.value,
      id: this.editedData().id
    });
  }

  Cancel() {
    this.modalController.dismiss({
      canseled: true
    });
  }

  SetMinus() {
    this.minus = this.minus*(-1);
  }

  OnAddClick(quontity:number) {
    const val = this.form.get('quontity')!.value;
    this.form.get('quontity')?.patchValue(val+quontity*this.minus);
  }

  EnterNumber() {
    const input = this.focusOnEnterElement();
    if (input) {
      input.setFocus()
    }
  }
}
