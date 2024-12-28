import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar, IonNav } from '@ionic/angular/standalone';
import { AddressAutocompleteComponent } from 'src/app/components/address-autocomplete/address-autocomplete.component';
import { DocumentListPage } from './document-list/document-list.page';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.page.html',
  styleUrls: ['./visits.page.scss'],
  standalone: true,
  imports: [IonNav]
})
export class VisitsPage {
  documentList = DocumentListPage

  constructor() {
    console.log('CREATE VISITS')
   }


}
