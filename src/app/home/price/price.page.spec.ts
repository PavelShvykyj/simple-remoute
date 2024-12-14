import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PricePage } from './price.page';

describe('PricePage', () => {
  let component: PricePage;
  let fixture: ComponentFixture<PricePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PricePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
