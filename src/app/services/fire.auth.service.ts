import {
  Injectable,
  WritableSignal,
  Signal,
  inject,
  signal,
  computed
} from '@angular/core';

import { Auth, signInWithEmailAndPassword, signOut, UserCredential, sendPasswordResetEmail } from '@angular/fire/auth';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class FireAuthService {
  private notificator = inject(NotificationService);
  private auth: Auth = inject(Auth);  // Corrected to use inject() instead of Inject
  private credentional: WritableSignal<UserCredential | null> = signal(null);
  public isLoggedin = computed(() => !!this.credentional());
  public LoggedStatus: Signal<'pending' | 'loggedin' | 'loggedout'> = computed(
    () => {
      if (this.isPending()) {
        return 'pending';
      }
      if (!!this.credentional()) {
        return 'loggedin';
      }
      return 'loggedout';
    }
  );

  get User(): UserCredential | null {
    return this.credentional();
  }

  private isPending: WritableSignal<boolean> = signal(false);

  loggIn(email: string, pass: string) {
    this.isPending.set(true);
    signInWithEmailAndPassword(this.auth, email, pass)
      .then((userCredential) => {
        this.credentional.set(userCredential);
        this.notificator.NotificateSuccess('Login');
      })
      .catch((error) => {
        console.error('ERRoR', JSON.stringify(error));
        this.credentional.set(null);
        this.notificator.NotificateError(
          'Login:  '.concat(JSON.stringify(error))
        );
      })
      .finally(() => {
        this.isPending.set(false);
      });
  }

  logOut() {
    this.isPending.set(true);
    return signOut(this.auth)
      .then(() => {
        this.credentional.set(null);
        this.notificator.NotificateSuccess('Logout');
      })
      .finally(() => {
        this.isPending.set(false);
      });
  }

  passwordReset(email: string) {
    this.isPending.set(true);
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.notificator.NotificateSuccess(`Reset password link was sent to ${email}`);
      })
      .catch((error) => {
        console.log(error);
        this.notificator.NotificateError(
          'Reset:  '.concat(JSON.stringify(error))
        );
      })
      .finally(() => {
        this.isPending.set(false);
      });
  }
}
