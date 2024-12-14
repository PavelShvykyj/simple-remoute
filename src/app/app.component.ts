import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonRefresher, IonRefresherContent, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonContent, IonApp, IonRouterOutlet, IonRefresher, IonRefresherContent],
})
export class AppComponent {
  handleRefresh(event: any) {
    window.location.reload();

    setTimeout(() => {
      event.target?.complete();
    }, 1000);
  }
}
