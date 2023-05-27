import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthService} from '../../../auth/auth.service';
import {UserSettingsComponent} from './user-settings.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {of} from 'rxjs';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  const mockAuthService = {
    user: {id: 1, name: 'Test User', email: 'test@mail.com'},
    updateUser: jasmine.createSpy('updateUser').and.returnValue(of({})),
    refreshTokens: jasmine.createSpy('refreshTokens'),
    logout: jasmine.createSpy('logout')
  };

  const mockDialogData = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSettingsComponent],
      imports: [BrowserAnimationsModule],
      providers: [
        {provide: MatDialogRef, useValue: mockDialogRef},
        {provide: AuthService, useValue: mockAuthService},
        {provide: MAT_DIALOG_DATA, useValue: mockDialogData},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the correct form when openForm is called', () => {
    component.openForm('user');
    expect(component.activeForm).toEqual('user');
    expect(component.isOpened).toEqual(true);
  });

  // More tests can be written here.
});
