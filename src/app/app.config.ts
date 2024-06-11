import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

const firebaseConfig = {
  apiKey: "AIzaSyDvb0J5_dWB7LPDi64m38EE55220E5Pd8M",
  authDomain: "authangular-1b0fb.firebaseapp.com",
  databaseURL: "https://authangular-1b0fb-default-rtdb.firebaseio.com",
  projectId: "authangular-1b0fb",
  storageBucket: "authangular-1b0fb.appspot.com",
  messagingSenderId: "272289484663",
  appId: "1:272289484663:web:7de709a75dfa032ca0db72"

}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(),
    provideHttpClient(),
    importProvidersFrom([
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireAuthModule,
      AngularFireDatabaseModule,
      AngularFirestoreModule
    ]), provideCharts(withDefaultRegisterables())
  ]
};
