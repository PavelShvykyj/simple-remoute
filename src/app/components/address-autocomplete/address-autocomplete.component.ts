import { Component, OnInit, DestroyRef, inject, } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonCard,
  IonInput,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonList,
  IonButton, IonIcon, IonListHeader } from '@ionic/angular/standalone';
import { DEFOULT_REGION } from 'src/app/constants/defoult.values';

@Component({
  selector: 'app-address-autocomplete',
  templateUrl: './address-autocomplete.component.html',
  styleUrls: ['./address-autocomplete.component.scss'],
  standalone: true,
  imports: [IonListHeader, IonIcon,
    ReactiveFormsModule,
    IonButton,
    IonList,
    IonItem,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonInput,
    IonCard,

  ]
})
export class AddressAutocompleteComponent  implements OnInit {
  predictions: google.maps.places.AutocompletePrediction[] = [];
  housePredictions: google.maps.places.AutocompletePrediction[] = [];
  destroyRef$ = inject(DestroyRef);


  private autocompleteService!: google.maps.places.AutocompleteService;

  addressForm = new FormGroup({
    country: new FormControl(DEFOULT_REGION.country, { nonNullable: true }),
    region: new FormControl(DEFOULT_REGION.region, { nonNullable: true }),
    city: new FormControl(DEFOULT_REGION.city, { nonNullable: true }),
    street: new FormControl('', { nonNullable: true, validators: [Validators.required], updateOn: 'blur' }  ),
    house: new FormControl('', { nonNullable: true, validators: [Validators.required], updateOn: 'blur' }),
  })

  get selectedStreet(): string {
    return this.addressForm.get('street')?.value ?? '';
  }

  set selectedStreet(value: string) {
    this.addressForm.get('street')?.patchValue(value, { emitEvent: false })
  }


  constructor() { }

  ngOnInit() {
    this.autocompleteService = new google.maps.places.AutocompleteService();

    this.addressForm.get('street')?.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef$))
    .subscribe(streetValue => this.onStreetInput(streetValue));
  }

  selectStreet(prediction: google.maps.places.AutocompletePrediction) {
    this.housePredictions = [];
    this.selectedStreet = prediction.description;
  }


  onStreetInput(streetValue: string) {
    const address = {...this.addressForm.value};
    address.street = streetValue;
    console.log('onStreetInput', streetValue)
    if (address.street) {
      const query = `${address.country}, ${address.region}, ${address.city}, ${address.street}`;
      console.log('query',query)
      this.autocompleteService.getPlacePredictions(
        { input: query,
          types: ['address'],
          componentRestrictions: { country: 'ua' },
        },
        (predictions, status) => {
          console.log('predictions, status',predictions, status);
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.predictions = (predictions || []).filter(prediction =>
              prediction.description.includes(address.city!));
          } else {
            this.predictions = [];
          }
        }
      );
    } else {
      this.predictions = [];
    }
  }

  onHouseInput(event: any) {
    const address = this.addressForm.value

    if (address.house && address.street) {
      const query = `${address.house}, ${address.street}`;
      this.autocompleteService.getPlacePredictions(
        { input: query, types: ['address'] },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.housePredictions = predictions || [];
          } else {
            this.housePredictions = [];
          }
        }
      );
    } else {
      this.housePredictions = [];
    }
  }

  onBlurButtonClick(inputElement: IonInput) {
    inputElement.getInputElement().then(el=> el.blur());
  }

  confirmAddress() {

  }
}
