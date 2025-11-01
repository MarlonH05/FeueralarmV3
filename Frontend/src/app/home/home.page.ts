import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moon, sunny, contrast } from 'ionicons/icons';

import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
  ],
})
export class HomePage implements OnInit {
  currentTheme: string = '';
  themeIcon: string = 'moon';

  constructor(private themeService: ThemeService) {
    // Register icons
    addIcons({ moon, sunny, contrast });
  }

  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeIcon = this.themeService.getThemeIcon();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themeIcon = this.themeService.getThemeIcon();
    console.log('Theme changed to:', this.currentTheme);
  }
}
