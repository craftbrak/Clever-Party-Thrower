import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddressFormComponent} from './address-form.component';
import {FormBuilder} from "@angular/forms";
import {Apollo} from "apollo-angular";

describe('AddressFormComponent', () => {
  let component: AddressFormComponent;
  let fixture: ComponentFixture<AddressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressFormComponent],
      providers: [FormBuilder, Apollo]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
