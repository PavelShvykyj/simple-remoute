import { Injectable, inject } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private toastController: ToastController = inject(ToastController);
  private sharedOptions: ToastOptions = {
    duration: 2000,
    position: 'top',
    positionAnchor: "header"

  }

  constructor() { }

  public NotificateSuccess(content: string) {
    const options: ToastOptions = {
      ...this.sharedOptions,
      color: "success",
      header:"Success",
      message: content
    }
    this.show(options);
  }
  public NotificateError(content: string) {
    const options: ToastOptions = {
      ...this.sharedOptions,
      color: "danger",
      header:"Errors",
      duration: 3000,
      message: content
    }
    this.show(options);
  }

  public NotificateWorning(content: string) {
    const options: ToastOptions = {
      ...this.sharedOptions,
      color: "warning",
      header:"Warning",
      message: content
    }
    this.show(options);
  }


  private async show(options: ToastOptions) {
      const toast = await this.toastController.create(options);
      await toast.present();
  }

}
