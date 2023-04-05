import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrivingLicenceFormComponent } from './driving-licence-form.component';

describe('DrivingLicenceFormComponent', () => {
  let component: DrivingLicenceFormComponent;
  let fixture: ComponentFixture<DrivingLicenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrivingLicenceFormComponent ]
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
