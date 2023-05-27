import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {DrivingLicenceFormComponent} from './driving-licence-form.component';
import {By} from '@angular/platform-browser';

describe('DrivingLicenceFormComponent', () => {
  let component: DrivingLicenceFormComponent;
  let fixture: ComponentFixture<DrivingLicenceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatSlideToggleModule, BrowserAnimationsModule],
      declarations: [DrivingLicenceFormComponent]
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

  it('should emit valid and licence events when form value changes', () => {
    spyOn(component.valid, 'emit');
    spyOn(component.licence, 'emit');

    const licenceValue = {drivingLicence: true, manual: true};
    component.drivingLicenceForm.setValue(licenceValue);

    expect(component.valid.emit).toHaveBeenCalledWith(true);
  });

  it('should show manual transmission toggle only when driving licence is true', () => {
    let manualToggle = fixture.debugElement.query(By.css('mat-slide-toggle[formControlName="manual"]'));
    expect(manualToggle).toBeFalsy();

    component.drivingLicenceForm.controls['drivingLicence'].setValue(true);
    fixture.detectChanges();

    manualToggle = fixture.debugElement.query(By.css('mat-slide-toggle[formControlName="manual"]'));
    expect(manualToggle).toBeTruthy();
  });
});
