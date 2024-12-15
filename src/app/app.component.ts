import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonRefresher, IonRefresherContent, IonContent } from '@ionic/angular/standalone';
import { ThemeService } from './services/theme-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonContent, IonApp, IonRouterOutlet, IonRefresher, IonRefresherContent],
})
export class AppComponent {
  constructor(private themeService: ThemeService) {
    this.themeService.initThemeListener();
  }

  handleRefresh(event: any) {
    window.location.reload();

    setTimeout(() => {
      event.target?.complete();
    }, 1000);
  }
}
