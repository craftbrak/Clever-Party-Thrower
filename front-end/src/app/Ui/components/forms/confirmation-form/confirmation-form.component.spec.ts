import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ConfirmationFormComponent} from './confirmation-form.component';
import {AddressService} from '../../../../services/address.service';
import {of} from 'rxjs';

describe('ConfirmationFormComponent', () => {
  let component: ConfirmationFormComponent;
  let fixture: ComponentFixture<ConfirmationFormComponent>;
  let mockAddressService: any;

  beforeEach(async () => {
    mockAddressService = jasmine.createSpyObj(['getCountries']);
    mockAddressService.getCountries.and.returnValue(of({
      data: {
        countries: [{id: '1', name: 'Country1'}, {
          id: '2',
          name: 'Country2'
        }]
      }
    }));

    await TestBed.configureTestingModule({
      declarations: [ConfirmationFormComponent],
      providers: [
        {provide: AddressService, useValue: mockAddressService},
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should emit submitForm event when onSubmit is called', () => {
    spyOn(component.submitForm, 'emit');

    component.onSubmit();

    expect(component.submitForm.emit).toHaveBeenCalled();
  });
});
