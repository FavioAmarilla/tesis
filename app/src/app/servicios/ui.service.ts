import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(
    private alertaCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  async alerta(message: string) {
    const alert = await this.alertaCtrl.create({
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async toast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: 'bottom',
      duration: 1500
    });

    await toast.present();
  }


}
