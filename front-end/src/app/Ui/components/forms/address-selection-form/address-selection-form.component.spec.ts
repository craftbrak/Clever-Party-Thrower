import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddressSelectionFormComponent} from './address-selection-form.component';

describe('AddressSelectionFormComponent', () => {
  let component: AddressSelectionFormComponent;
  let fixture: ComponentFixture<AddressSelectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressSelectionFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
