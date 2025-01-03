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
  chevronDownCircle,
} from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as GoodsActions from '../state/goods.actions';
import * as DocsActions from '../state/documents/doc.actions';

import { selectIsLoaded } from '../state/goods.selectors';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { selectIsVisitsLoaded } from '../state/documents/doc.selectors';

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

  isVisitsLoaded : Signal<boolean> = toSignal(this.store.pipe(select(selectIsVisitsLoaded)), {
    initialValue: false,
  });

  showTabs: WritableSignal<boolean> = signal(true);

  constructor() {
    addIcons({
      chevronDownCircle,
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
    this.store.dispatch(DocsActions.syncVisits());


    this.router.events
      .subscribe((event) => {
        if(event instanceof NavigationEnd) {
          if (event.url.includes('/visit')) {
            this.showTabs.set(false);
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
