import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {CreateCarFormComponent} from './create-car-form.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';

describe('CreateCarFormComponent', () => {
  let component: CreateCarFormComponent;
  let fixture: ComponentFixture<CreateCarFormComponent>;
  let mockDialogRef: MatDialogRef<CreateCarFormComponent>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj(['close']);

    await TestBed.configureTestingModule({
      declarations: [CreateCarFormComponent],
      providers: [
        FormBuilder,
        {provide: MatDialogRef, useValue: mockDialogRef}
      ],
      imports: [ReactiveFormsModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatSliderModule, MatButtonModule, NoopAnimationsModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCarFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.carForm.value).toEqual({
      brand: '',
      model: '',
      maxPassengers: '',
      consumption: '',
      bootSize: '',
      fuel: '',
      manualTransmission: '',
      range: ''
    });
  });

  it('should close dialog with form value on submit', () => {
    component.carForm.setValue({
      brand: 'Brand',
      model: 'Model',
      maxPassengers: 5,
      consumption: 10,
      bootSize: 'Large',
      fuel: 'Petrol',
      manualTransmission: true,
      range: 500
    });

    component.submitForm();

    expect(mockDialogRef.close).toHaveBeenCalledWith({
      brand: 'Brand',
      model: 'Model',
      maxPassengers: 5,
      consumption: 10,
      bootSize: 'Large',
      fuel: 'Petrol',
      manualTransmission: true,
      range: 500
    });
  });

  it('should not close dialog when form is invalid', () => {
    component.submitForm();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });
});
