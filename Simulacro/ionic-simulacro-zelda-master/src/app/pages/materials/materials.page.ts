import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList,
  IonMenuToggle, IonModal, IonText, IonTitle, IonToolbar } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { power } from 'ionicons/icons';
import { ZeldaService } from '../../services/zelda-service';
import { ZeldaMaterial } from '../../common/models/zelda.model';
import {MenuComponent} from "../../components/menu/menu.component";
import {ToastService} from "../../services/toast-service";

@Component({
  standalone: true,
  selector: 'app-materials',
  templateUrl: './materials.page.html',
  styleUrls: ['./materials.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonAvatar,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonMenuToggle,
    MenuComponent,
    IonModal,
    IonButtons,
    IonText,
  ],
})
export class MaterialsPage implements OnInit {
  private readonly zeldaService: ZeldaService = inject(ZeldaService);
  private readonly toastService: ToastService = inject(ToastService);
  materials = signal<ZeldaMaterial[]>([]);
  randomNumber = signal<number>(0);

  constructor() {
    addIcons({ power });
  }

  ngOnInit() {
    this.loadMaterials();
  }

  private loadMaterials() {
    this.zeldaService.getZeldaMaterials().subscribe({
      next: (res) => {
        this.materials.set(res.data);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  protected generateRandom() {
    this.randomNumber.set(Math.floor(Math.random() * this.materials().length));
  }

  protected onWillDismiss(event: CustomEvent) {
    if (event.detail.role === 'cancel') {
      this.toastService.showToast('Cancelado','danger');
    }
    if (event.detail.role === 'aceptar') {
      this.toastService.showToast('Aceptado: '+ this.materials()[this.randomNumber()].name,'primary');
    }
  }
}
