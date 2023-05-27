import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {DateSelectionFormComponent} from './date-selection-form.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';

describe('DateSelectionFormComponent', () => {
  let component: DateSelectionFormComponent;
  let fixture: ComponentFixture<DateSelectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatButtonModule, MatIconModule, MatNativeDateModule, BrowserAnimationsModule, NoopAnimationsModule],
      declarations: [DateSelectionFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit dates and valid events when form value changes', () => {
    spyOn(component.dates, 'emit');
    spyOn(component.valid, 'emit');

    const date = new Date();
    component.dateForm.controls['date'].setValue(date);

    expect(component.dates.emit).toHaveBeenCalledWith([date]);
    expect(component.valid.emit).toHaveBeenCalledWith(true);
  });


  it('should add date when addDate is called', () => {
    component.dateForm.controls['isMultipleDates'].setValue(true);
    const date = new Date();
    component.dateForm.controls['date'].setValue(date);

    component.addDate();

    expect(component.selectedDates).toContain(date);
  });

});
