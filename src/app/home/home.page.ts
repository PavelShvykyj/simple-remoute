import { Component, effect, inject, OnInit, Signal } from '@angular/core';
import {
  IonGrid,
  IonRow,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonTabBar,
  IonTab,
  IonIcon,
  IonTabs,
  IonTabButton,
  IonLabel,
  IonItem,
  IonSpinner,
  IonCol,
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
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as GoodsActions from '../state/goods.actions';
import { selectIsLoaded } from '../state/goods.selectors';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
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
  route = inject(ActivatedRoute);
  store: Store = inject(Store);
  isLoded: Signal<boolean> = toSignal(this.store.pipe(select(selectIsLoaded)), {
    initialValue: false,
  });

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
        this.router.navigate(['price'], { relativeTo: this.route });
      }
    });
  }

  ngOnInit(): void {
    this.store.dispatch(GoodsActions.syncGoods());
  }

  onLogout() {
    this.auth.logOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
