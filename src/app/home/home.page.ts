import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonTabBar, IonTab, IonIcon, IonTabs, IonTabButton, IonLabel } from '@ionic/angular/standalone';
import { FireAuthService } from '../services/fire.auth.service';
import {
  barChartOutline,
  lockClosedOutline,
  lockOpenOutline,
  appsOutline
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonLabel, IonTabs, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonTabBar, IonTab, IonTabButton],
})
export class HomePage {
  auth: FireAuthService = inject(FireAuthService);
  router: Router = inject(Router);
  constructor() {
    addIcons({
      barChartOutline,
      lockClosedOutline,
      lockOpenOutline,
      appsOutline });
  }

  onLogout() {
    this.auth.logOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
