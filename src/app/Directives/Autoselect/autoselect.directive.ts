import { Directive, HostListener } from '@angular/core';
import { IonInput } from '@ionic/angular';

@Directive({
  selector: '[appAutoselect]',
  standalone: true,
})
export class AutoselectDirective {

  @HostListener('ionFocus', ['$event'])
  public onIonInputFocus(focusEvent: CustomEvent): void {
    const target = focusEvent?.target as IonInput | null;
    if (target) {
      target.getInputElement().then((el: HTMLInputElement) => {
        //console.log('DIRECTIVE element', focusEvent.target);
        el.select();
      });
    }
  }

  @HostListener('focus', ['$event'])
  public onInputFocus(focusEvent: FocusEvent): void {
    const el = focusEvent.target as HTMLInputElement | null;
    if (el) {
      setTimeout(() => {
        el.select();
      });
    }
  }
}
