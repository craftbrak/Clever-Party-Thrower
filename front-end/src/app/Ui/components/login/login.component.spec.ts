import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LoginComponent} from './login.component';
import {AuthService} from '../../../auth/auth.service';
import {FormBuilder, FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['login']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [FormsModule],
      providers: [
        {provide: AuthService, useValue: authService},
        {provide: Router, useValue: router},
        FormBuilder
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call AuthService.login() and navigate to protected route on successful login', () => {
    const email = 'test@example.com';
    const password = 'password';
    component.email = email;
    component.password = password;

    (authService.login as jasmine.Spy).and.returnValue(of({}));
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(email, password);
    expect(router.navigate).toHaveBeenCalledWith(['/protected-route']);
  });

  it('should handle errors on unsuccessful login', () => {
    const email = 'test@example.com';
    const password = 'password';
    component.email = email;
    component.password = password;

    (authService.login as jasmine.Spy).and.returnValue(throwError(new Error('Login failed')));
    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith(email, password);
    // Add any necessary error handling assertions, such as displaying an error message
  });
});
