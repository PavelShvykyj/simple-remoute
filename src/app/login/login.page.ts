import { Component, OnInit, WritableSignal, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  closeOutline,
  checkmarkOutline,
} from 'ionicons/icons';
import { FireAuthService } from '../services/fire.auth.service';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonList,
  IonItem,
  IonButtons,
  IonButton,
  IonSplitPane,
  IonAvatar,
  IonNote,
  IonText,
  IonSpinner,
  IonMenu,
  IonIcon,
  IonListHeader,
  IonFooter,
  IonModal,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonAlert,
  IonGrid,
  IonRow,
  IonCol,
  IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { AutoselectDirective } from '../Directives/autoselect/autoselect.directive';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    AutoselectDirective,
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonItem,
    IonButtons,
    IonButton,
    IonAvatar,
    IonNote,
    IonSpinner,
    IonIcon,
    IonFooter,
    IonGrid,
    IonRow,
    IonCol,
    IonInput
],
})
export class LoginPage  {
  focusOnEnterElement = viewChild<IonInput>('focusOnEnter');
  auth = inject(FireAuthService);
  router = inject(Router);
  credentionals = {
    email: "",
    password: ""
  }

  constructor() {
    addIcons({ closeOutline, checkmarkOutline });
    effect(()=>{
      if(this.auth.LoggedStatus() === 'loggedin') {
        this.router.navigate(['home'])
      }
    })
  }

  ionViewDidEnter() {
    const input = this.focusOnEnterElement();
    if (input) {
      input.setFocus()
    }
  }

  onLoggin() {
    this.auth.loggIn(this.credentionals.email,this.credentionals.password);
  }

  OnForgotPassword(isValid: boolean | null) {
    if (!isValid) {
      return;
    }

    this.auth.passwordReset(this.credentionals.email);
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${inputLength} characters are typed`;
  }

  onPasswordChange(isValid: boolean | null) {
    if (isValid) {
      this.onLoggin();
    }
  }

  ionViewWillLeave() {
    this.credentionals = {
      email: "",
      password: ""
    }
  }
}
