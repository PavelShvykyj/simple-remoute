import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import {
  IonGrid,
  IonRow,
  IonContent,
  IonTabBar,
  IonIcon,
  IonTabs,
  IonTabButton,
  IonLabel,
  IonItem,
  IonSpinner,
  IonCol,
  NavController,
} from '@ionic/angular/standalone';
import { FireAuthService } from '../services/fire.auth.service';
import {
  barChartOutline,
  lockClosedOutline,
  lockOpenOutline,
  appsOutline,
  settingsOutline,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as GoodsActions from '../state/goods.actions';
import { selectIsLoaded } from '../state/goods.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    NgClass,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
    IonTabs,
    IonIcon,
    IonContent,
    IonTabBar,
    IonTabButton,
    IonItem,
    IonSpinner,
  ],
})
export class HomePage implements OnInit {
  auth: FireAuthService = inject(FireAuthService);
  router: Router = inject(Router);
  navigator = inject(NavController);
  store: Store = inject(Store);
  isLoded: Signal<boolean> = toSignal(this.store.pipe(select(selectIsLoaded)), {
    initialValue: false,
  });
  showTabs: WritableSignal<boolean> = signal(true);

  constructor() {
    addIcons({
      settingsOutline,
      barChartOutline,
      lockClosedOutline,
      lockOpenOutline,
      appsOutline,
    });

    effect(() => {
      if (this.isLoded()) {
        this.navigator.navigateForward('home/price');
      }
    });
  }

  ngOnInit(): void {
    this.store.dispatch(GoodsActions.syncGoods());

    this.router.events
      .subscribe((event) => {
        console.log('event',event, event instanceof NavigationEnd)
        if(event instanceof NavigationEnd) {
          if (event.url.includes('/visits')) {
            this.showTabs.set(false);
            console.log('showTabs',this.showTabs());
          } else {
            this.showTabs.set(true);
          }
          }
      });
  }

  onLogout() {
    this.auth.logOut().then(() => {
      this.navigator.navigateRoot('login');
    });
  }
}
