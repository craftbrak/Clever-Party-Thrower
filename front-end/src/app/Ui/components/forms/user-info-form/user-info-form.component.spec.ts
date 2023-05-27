import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UserInfoFormComponent} from './user-info-form.component';
import {JWTPayload} from '../../../../entities/JWTPayload.entity';

describe('UserInfoFormComponent', () => {
  let component: UserInfoFormComponent;
  let fixture: ComponentFixture<UserInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
      declarations: [UserInfoFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update form with input changes', () => {
    // @ts-ignore
    const testPayload: JWTPayload = {email: 'test@example.com', name: 'Test User'};
    component.userInfoInput = testPayload;
    component.ngOnChanges({
      userInfoInput: {
        currentValue: testPayload,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    expect(component.userInfoForm.get('email')?.value).toEqual(testPayload.email);
    expect(component.userInfoForm.get('name')?.value).toEqual(testPayload.name);
  });
});
