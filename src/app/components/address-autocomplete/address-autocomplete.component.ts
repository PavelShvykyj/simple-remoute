import { Component, OnInit, DestroyRef, inject, input, OnDestroy, signal, viewChild, computed, } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonInput,
  IonItem,
  IonButton,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownCircle, closeCircle, searchOutline } from 'ionicons/icons';
import { map } from 'rxjs';
import { DEFAULT_REGION } from 'src/app/constants/default.values';

@Component({
  selector: 'app-address-autocomplete',
  templateUrl: './address-autocomplete.component.html',
  styleUrls: ['./address-autocomplete.component.scss'],
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ],
  imports: [
    IonSelect,
    IonSelectOption,
    IonSpinner,
    ReactiveFormsModule,
    IonRow,
    IonGrid,
    IonCol,
    IonIcon,
    IonButton,
    IonInput,
  ],
})
export class AddressAutocompleteComponent  implements OnInit, OnDestroy {
  predictions: google.maps.places.AutocompletePrediction[] = [];
  housePredictions: google.maps.places.AutocompletePrediction[] = [];
  destroyRef$ = inject(DestroyRef);
  parentFormContainer = inject(ControlContainer)
  controlKey = input.required<string>();
  controlLabel = input<string>('Address');
  addressIsSearching = signal(false);
  selectComponent = viewChild(IonSelect);


  addressForm = new FormGroup({
    country: new FormControl(DEFAULT_REGION.country, { nonNullable: true }),
    region: new FormControl(DEFAULT_REGION.region, { nonNullable: true }),
    city: new FormControl(DEFAULT_REGION.city, { nonNullable: true }),
    street: new FormControl('', { nonNullable: true, validators: [Validators.required]}  ),
    confirmedStreet: new FormControl('', { nonNullable: true, validators: [Validators.required] }  ),
    house: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    flat: new FormControl(0, { nonNullable: true, validators: [Validators.required] }),
  })
  streetIsComfirmed = toSignal(this.addressForm.get('confirmedStreet')!.valueChanges.pipe(map(value => !!value)), {initialValue: false});



  private autocompleteService!: google.maps.places.AutocompleteService;



  get parentFormGroup() {
    return this.parentFormContainer.control as FormGroup
  }

  get selectedStreet(): string {
    return this.addressForm.get('street')?.value ?? '';
  }

  set selectedStreet(value: string) {
    this.addressForm.get('street')?.patchValue(value, { emitEvent: false })
  }


  constructor() {
    addIcons({chevronDownCircle,searchOutline,closeCircle,});
  }

  ngOnInit() {
    this.parentFormGroup.addControl(this.controlKey(), this.addressForm)

    this.autocompleteService = new google.maps.places.AutocompleteService();

    this.addressForm.get('street')
      ?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe(() => {
        this.addressForm.get('confirmedStreet')?.setValue('');
        this.predictions = []
      });
  }

  ngOnDestroy() {
    this.parentFormGroup.removeControl(this.controlKey())
  }

  selectStreet(prediction: google.maps.places.AutocompletePrediction) {
    this.housePredictions = [];
    this.selectedStreet = prediction.description;
  }


  onStreetSearch() {
    this.predictions = [];
    const address = {...this.addressForm.value};
    address.street = address.street ?? '';
    if (!address.street) {
      return
    }
      this.addressIsSearching.set(true);
      const query = `${address.country}, ${address.region}, ${address.city}, ${address.street}`;
      this.autocompleteService.getPlacePredictions(
        { input: query,
          types: ['address'],
          componentRestrictions: { country: 'ua' },
        },
        (predictions, status) => {
          this.addressIsSearching.set(false);
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.predictions = (predictions || []).filter(prediction =>
              prediction.description.includes(address.city!));
            setTimeout(()=>{this.selectComponent()?.open();},0)
          } else {
            this.predictions = [];
          }
        }
      );

  }

  onConfirmedStreetChange(event: any) {
    this.predictions = [];
    this.addressForm.get('street')?.setValue(event.detail.value.description);
    this.addressForm.get('confirmedStreet')?.setValue(event.detail.value.structured_formatting.main_text);
  }

  onConfirmedStreetCancel() {
    this.predictions = [];
    this.addressForm.get('confirmedStreet')?.setValue('');
  }

  onConfirmedStreetDismiss() {
    this.predictions = [];
    this.addressForm.get('confirmedStreet')?.setValue('');
  }



}
