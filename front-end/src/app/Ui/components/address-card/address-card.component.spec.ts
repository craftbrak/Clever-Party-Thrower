import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {AddressCardComponent} from './address-card.component';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('AddressCardComponent', () => {
  let component: AddressCardComponent;
  let fixture: ComponentFixture<AddressCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressCardComponent],
      imports: [NoopAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressCardComponent);
    component = fixture.componentInstance;
    component.address = {
      line1: '123 Test Street',
      unitNumber: '5A',
      city: 'Test City',
      postalCode: '12345',
      country: {
        name: 'Test Country'
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the address details', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h3').textContent).toContain('123 Test Street 5A');
    expect(compiled.querySelector('p').textContent).toContain('Test City, 12345');
  });

  it('should emit cardClick event when card is clicked', () => {
    spyOn(component.cardClick, 'emit');

    const card = fixture.debugElement.query(By.css('mat-card'));
    card.triggerEventHandler('click', null);

    fixture.detectChanges();

    expect(component.cardClick.emit).toHaveBeenCalled();
  });
});
