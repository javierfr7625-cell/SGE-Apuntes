import { Component, OnInit } from '@angular/core';
import { addIcons } from 'ionicons';
import {
  IonAvatar,
  IonContent, IonIcon, IonItem, IonLabel, IonList,
  IonMenu, IonMenuToggle, IonText
} from '@ionic/angular';
import { cog, settings } from 'ionicons/icons';


@Component({
  selector: 'app-menu',
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [IonMenu, IonContent, IonText, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonAvatar],
})
export class MenuComponent implements OnInit {
  constructor() {
    addIcons({ cog, settings });
  }

  ngOnInit() {}
}
