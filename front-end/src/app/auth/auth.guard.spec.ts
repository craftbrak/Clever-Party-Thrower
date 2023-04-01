import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {AuthService} from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['isAuthenticated']);

    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        {provide: AuthService, useValue: authService},
        {provide: Router, useValue: router},
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when the user is authenticated', () => {
    (authService.isAuthenticated as jasmine.Spy).and.returnValue(true);
    expect(guard.canActivate({} as any, {} as any)).toBe(true);
  });

  it('should return false and navigate to login page when the user is not authenticated', () => {
    (authService.isAuthenticated as jasmine.Spy).and.returnValue(false);
    expect(guard.canActivate({} as any, {} as any)).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
