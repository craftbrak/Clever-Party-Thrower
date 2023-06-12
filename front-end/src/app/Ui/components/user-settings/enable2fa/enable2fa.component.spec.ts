import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../../../auth/auth.service';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {Enable2faComponent} from './enable2fa.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('Enable2faComponent', () => {
  let component: Enable2faComponent;
  let fixture: ComponentFixture<Enable2faComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['enable2faStep1', 'enable2faStep2']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [Enable2faComponent],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        {provide: Router, useValue: routerSpy},
        FormBuilder
      ],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        NoopAnimationsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Enable2faComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty verification code', () => {
    authService.enable2faStep1.and.returnValue(of('testUrl'));
    fixture.detectChanges();

    expect(component.verificationForm?.get('verificationCode')?.value).toBe('');
  });

  it('should call enable2faStep1 on init', () => {
    authService.enable2faStep1.and.returnValue(of('testUrl'));
    fixture.detectChanges();

    expect(authService.enable2faStep1).toHaveBeenCalled();
  });

  it('should call enable2faStep2 on submit', () => {
    authService.enable2faStep1.and.returnValue(of('testUrl'));
    authService.enable2faStep2.and.returnValue(of({status: 'success'}));
    fixture.detectChanges();

    component.onSubmit();

    expect(authService.enable2faStep2).toHaveBeenCalled();
  });

  it('should navigate to root on finish', () => {
    component.finish();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set isScanned to true on scan', () => {
    component.onScan();

    expect(component.isScanned).toBeTrue();
  });
});
