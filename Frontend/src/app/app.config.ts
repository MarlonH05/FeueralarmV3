import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { routes } from './app.routes';

// Socket.io Configuration
const socketConfig: SocketIoConfig = {
  url: 'https://alarm-bso.herokuapp.com',
  options: {
    transports: ['websocket', 'polling'],
    autoConnect: false,
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular(),
    provideHttpClient(),
    importProvidersFrom(SocketIoModule.forRoot(socketConfig)),
  ],
};
