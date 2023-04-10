import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DrivingLicenceFormComponent} from './driving-licence-form.component';
import {FormBuilder} from "@angular/forms";

describe('DrivingLicenceFormComponent', () => {
  let component: DrivingLicenceFormComponent;
  let fixture: ComponentFixture<DrivingLicenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrivingLicenceFormComponent],
      providers: [FormBuilder]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrivingLicenceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
