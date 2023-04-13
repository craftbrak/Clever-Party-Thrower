import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DateSelectionFormComponent} from './date-selection-form.component';

describe('DateSelectionFormComponent', () => {
  let component: DateSelectionFormComponent;
  let fixture: ComponentFixture<DateSelectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
});
