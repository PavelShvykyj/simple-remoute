import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { GoodsEffects } from './app/state/good.effects';
import { goodsReducer } from './app/state/reducer';

const firebaseConfig = {
  apiKey: "AIzaSyBRcOZ52d_YPrp2q5XVRYez_xVN1yf5BDI",
  authDomain: "simple-tech-trek.firebaseapp.com",
  databaseURL: "https://simple-tech-trek-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "simple-tech-trek",
  storageBucket: "simple-tech-trek.firebasestorage.app",
  messagingSenderId: "547594544139",
  appId: "1:547594544139:web:60eaa1116d11819b6ad30e"
};

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideStore({
      goods: goodsReducer
    }),
    provideEffects([GoodsEffects]),
  ],
});
