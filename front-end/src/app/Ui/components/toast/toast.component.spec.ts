import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ToastComponent} from './toast.component';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToastComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should correctly display the message', () => {
    component.message = 'This is a toast message';
    fixture.detectChanges();

    const toastMessage = fixture.debugElement.query(By.css('.toast span')).nativeElement;
    expect(toastMessage.textContent).toEqual('This is a toast message');
  });

  it('showToast should make the toast visible and then hide it after 2 seconds', fakeAsync(() => {
    expect(component.show).toBeFalsy();
    component.showToast();
    expect(component.show).toBeTruthy();

    tick(2000);
    expect(component.show).toBeFalsy();
  }));
});
