import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {EventInfoFormComponent} from './event-info-form.component';

describe('EventInfoFormComponent', () => {
  let component: EventInfoFormComponent;
  let fixture: ComponentFixture<EventInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
      declarations: [EventInfoFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit valid and eventInfo events when form value changes', () => {
    spyOn(component.valid, 'emit');
    spyOn(component.eventInfo, 'emit');

    const eventInfoValue = {eventName: 'Test Event', eventDescription: 'Test Event Description'};
    component.eventInfoForm.setValue(eventInfoValue);

    expect(component.valid.emit).toHaveBeenCalledWith(true);
    expect(component.eventInfo.emit).toHaveBeenCalledWith(eventInfoValue);
  });

  it('should validate form correctly', () => {
    component.eventInfoForm.controls['eventName'].setValue('');
    fixture.detectChanges();

    expect(component.eventInfoForm.valid).toBeFalsy();

    component.eventInfoForm.controls['eventName'].setValue('Test Event');
    fixture.detectChanges();

    expect(component.eventInfoForm.valid).toBeTruthy();
  });
});
