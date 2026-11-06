import { inject, Service } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Service()
export class ToastService {
  private readonly toastController: ToastController = inject(ToastController);

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      position: 'bottom',
      duration: 2000,
    });
    await toast.present();
  }
}
