import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Socket.io Configuration
const socketConfig: SocketIoConfig = {
  url: 'https://alarm-bso.herokuapp.com',
  options: {
    transports: ['websocket', 'polling'],
    autoConnect: false,
  },
};

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(SocketIoModule.forRoot(socketConfig)),
  ],
});
