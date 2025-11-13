import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RestService } from './rest.service';

export interface Alarm {
  _id: string;
  classCount: number;
  archived: boolean;
  created: string;
  updated: string;
  triggeredBy?: string;
  description?: string;
  location?: string;
  stats?: {
    total: number;
    complete: number;
    incomplete: number;
    undefined: number;
  };
}

// ✅ AlarmData als Alias für Alarm exportieren (für Kompatibilität)
export type AlarmData = Alarm;

export interface AlarmListResponse {
  success: boolean;
  message: string;
  alerts: Alarm[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AlarmDetailResponse {
  success: boolean;
  alert: Alarm;
  posts: any[];
}

@Injectable({
  providedIn: 'root',
})
export class AlarmService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient, private restService: RestService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.restService.getToken()}`,
    });
  }

  /**
   * Alle Alarme abrufen mit Pagination
   */
  getAllAlarms(
    page: number = 1,
    limit: number = 50
  ): Observable<AlarmListResponse> {
    return this.http.get<AlarmListResponse>(
      `${this.API_URL}/alerts?page=${page}&limit=${limit}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Einzelnen Alarm mit Posts abrufen
   */
  getAlarmById(id: string): Observable<AlarmDetailResponse> {
    return this.http.get<AlarmDetailResponse>(`${this.API_URL}/alerts/${id}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Alarm löschen (Admin only)
   */
  deleteAlarm(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/alerts/${id}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * Alarm archivieren (Admin only)
   */
  archiveAlarm(id: string): Observable<any> {
    return this.http.put(
      `${this.API_URL}/alerts/${id}/archive`,
      {},
      { headers: this.getHeaders() }
    );
  }

  /**
   * Formatiert Datum für Anzeige
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * ✅ Alias-Methode für formatDate (für Kompatibilität mit archive.page.ts)
   */
  formatAlarmDate(dateString: string): string {
    return this.formatDate(dateString);
  }

  /**
   * Berechnet Zeitdifferenz für "vor X Minuten"
   */
  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Min.`;
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;

    return this.formatDate(dateString);
  }

  /**
   * ✅ Alias-Methode für getTimeAgo (für Kompatibilität mit archive.page.ts)
   */
  getTimeSince(dateString: string): string {
    return this.getTimeAgo(dateString);
  }

  /**
   * Gibt Prozentsatz für Fortschritt zurück
   */
  getCompletionPercentage(alarm: Alarm): number {
    if (!alarm.stats || alarm.stats.total === 0) return 0;
    return Math.round((alarm.stats.complete / alarm.stats.total) * 100);
  }
}
