import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
  IonCheckbox,
  IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  flame,
  personOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  logInOutline,
  moon,
  sunny,
  contrast,
} from 'ionicons/icons';

import { RestService } from '../../services/rest.service';
import { FeedbackService } from '../../services/feedback.service';
import { ThemeService } from '../../services/theme.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonCheckbox,
    IonSpinner,
  ],
})
export class LoginPage implements OnInit {
  credentials = {
    email: '',
    password: '',
  };

  showPassword = false;
  stayLoggedIn = false;
  isLoading = false;
  themeIcon = 'moon';

  constructor(
    private restService: RestService,
    private feedbackService: FeedbackService,
    private themeService: ThemeService,
    private socketService: SocketService,
    private router: Router
  ) {
    // Register icons
    addIcons({
      flame,
      personOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      logInOutline,
      moon,
      sunny,
      contrast,
    });
  }

  ngOnInit() {
    this.themeIcon = this.themeService.getThemeIcon();
  }

  async login() {
    // Validation
    if (!this.credentials.email || !this.credentials.password) {
      await this.feedbackService.showErrorToast('Bitte alle Felder ausfüllen');
      return;
    }

    this.isLoading = true;

    try {
      // Login attempt
      const result = await this.restService.login(this.credentials);

      if (result.success) {
        // Save credentials if stay logged in
        if (this.stayLoggedIn) {
          localStorage.setItem('stayloggedin', 'true');
          localStorage.setItem('user', this.credentials.email);
          localStorage.setItem('password', this.credentials.password);
        }

        // Connect to socket
        await this.socketService.connect();

        // Success feedback
        await this.feedbackService.showSuccessToast('Erfolgreich angemeldet!');

        // Navigate to home
        this.router.navigate(['/home']);
      } else {
        // Show error
        await this.feedbackService.showErrorToast(
          result.error || 'Anmeldung fehlgeschlagen'
        );
      }
    } catch (error: any) {
      console.error('Login error:', error);
      await this.feedbackService.showErrorToast(
        'Verbindungsfehler. Bitte versuche es erneut.'
      );
    } finally {
      this.isLoading = false;
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.themeIcon = this.themeService.getThemeIcon();
  }
}
