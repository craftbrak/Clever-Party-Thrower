import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../../../auth/auth.service';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {UserSettingsComponent} from './user-settings.component';
import {of} from 'rxjs';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;
  let mockAuthService: Partial<AuthService>;
  let mockDialogRef: Partial<MatDialogRef<UserSettingsComponent>>;
  let mockRouter: Partial<Router>;
  let mockSanitizer: Partial<DomSanitizer>;

  beforeEach(async () => {
    mockAuthService = {
      user: {id: '1', name: 'Test User', email: "test@gmail.cum", iat: 2123323, exp: 213232},
      updateUser: jasmine.createSpy('updateUser').and.returnValue(of({})),
      refreshTokens: jasmine.createSpy('refreshTokens'),
      logout: jasmine.createSpy('logout'),
      sendVerifyEmail: jasmine.createSpy('sendVerifyEmail').and.returnValue(of({})),
    };

    mockDialogRef = {
      close: jasmine.createSpy('close'),
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    mockSanitizer = {
      sanitize: jasmine.createSpy('sanitize').and.returnValue('sanitizedUrl'),
    };

    await TestBed.configureTestingModule({
      declarations: [UserSettingsComponent],
      providers: [
        {provide: AuthService, useValue: mockAuthService},
        {provide: MatDialogRef, useValue: mockDialogRef},
        {provide: Router, useValue: mockRouter},
        {provide: DomSanitizer, useValue: mockSanitizer},
        {provide: MAT_DIALOG_DATA, useValue: {}},
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should navigate to setup2fa on open2FaSetup', () => {
    component.open2FaSetup();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/setup2fa']);
  });

  // Add more tests for other methods and interactions
});
