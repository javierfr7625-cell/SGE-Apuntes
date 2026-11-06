import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonText, IonTitle, IonToolbar } from '@ionic/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonCard,
    IonCardContent,
    IonText,
    IonButton,
    RouterLink,
  ],
})
export class InicioPage implements OnInit {
  slides: { texto: string; image: string; color: string }[] = [
    {
      texto: 'En este examen utilizaremos componentes de Ionic',
      image: 'assets/images/logo.avif',
      color: 'primary',
    },
    {
      texto: 'Pero trabajaremos con la API del Zelda',
      image: 'assets/images/link.jpg',
      color: 'secondary',
    },
    {
      texto: 'Para lograr el ansiado aprobado',
      image: 'assets/images/approved.png',
      color: 'success',
    },
  ];

  constructor() {}

  ngOnInit() {}
}
