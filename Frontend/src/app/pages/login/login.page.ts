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
import { environment } from '../../../environments/environment';

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
    username: '',
    password: '',
  };

  showPassword = false;
  stayLoggedIn = false;
  isLoading = false;
  themeIcon = 'moon';
  showTestLogin = environment.enableTestLogin;

  constructor(
    private restService: RestService,
    private feedbackService: FeedbackService,
    private themeService: ThemeService,
    private router: Router
  ) {
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
    // 🔒 Verhindere mehrfache Aufrufe
    if (this.isLoading) {
      console.warn('⚠️ Login bereits in Progress, ignoriere weiteren Aufruf');
      return;
    }

    if (!this.credentials.username || !this.credentials.password) {
      await this.feedbackService.showErrorToast('Bitte alle Felder ausfüllen');
      return;
    }

    console.log('🔐 Login gestartet...', this.credentials.username);
    this.isLoading = true;

    try {
      const result = await this.restService.login(this.credentials);
      console.log('✅ Login Resultat:', result);

      if (result && result.success) {
        console.log('📝 Speichere Login-Daten...');

        // Speichere Login-Daten wenn gewünscht
        if (this.stayLoggedIn) {
          localStorage.setItem('stayloggedin', 'true');
          localStorage.setItem('user', this.credentials.username);
          localStorage.setItem('password', this.credentials.password);
        }

        console.log('📢 Zeige Erfolgs-Toast...');
        // Toast anzeigen (ohne await - soll parallel laufen)
        this.feedbackService.showSuccessToast('Erfolgreich angemeldet!');

        console.log('🔓 Setze isLoading auf false...');
        // ⚠️ WICHTIG: isLoading VORHER auf false setzen
        this.isLoading = false;

        console.log('🚀 Starte Navigation zu /home...');
        // Navigation mit replaceUrl und setTimeout als Fallback
        setTimeout(async () => {
          try {
            const navigationSuccess = await this.router.navigate(['/home'], {
              replaceUrl: true,
            });
            console.log('✅ Navigation erfolgreich:', navigationSuccess);
          } catch (navError) {
            console.error('❌ Navigation Error:', navError);
            // Fallback: Hard reload
            window.location.href = '/home';
          }
        }, 100);
      } else {
        // Login fehlgeschlagen
        console.log('❌ Login fehlgeschlagen:', result?.error);
        this.isLoading = false;
        await this.feedbackService.showErrorToast(
          result?.error || 'Anmeldung fehlgeschlagen'
        );
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      this.isLoading = false;
      await this.feedbackService.showErrorToast(
        'Verbindungsfehler. Bitte versuche es erneut.'
      );
    }
  }

  async testLogin() {
    console.log('🧪 Aktiviere Test-Login');

    // Verhindere mehrfache Aufrufe
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    try {
      const result = await this.restService.testLogin();

      if (result.success) {
        await this.feedbackService.showSuccessToast('Test-Login erfolgreich!');
        this.isLoading = false;
        await this.router.navigate(['/home'], { replaceUrl: true });
      } else {
        this.isLoading = false;
        await this.feedbackService.showErrorToast('Test-Login fehlgeschlagen');
      }
    } catch (error) {
      console.error('Test-Login error:', error);
      this.isLoading = false;
      await this.feedbackService.showErrorToast('Test-Login fehlgeschlagen');
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
    this.themeIcon = this.themeService.getThemeIcon();
  }
}
