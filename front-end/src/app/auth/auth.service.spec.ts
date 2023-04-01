import {TestBed} from '@angular/core/testing';
import {AuthService} from './auth.service';
import {ApolloTestingController, ApolloTestingModule} from 'apollo-angular/testing';

describe('AuthService', () => {
  let service: AuthService;
  let apolloController: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
    });
    service = TestBed.inject(AuthService);
    apolloController = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    apolloController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login the user and store JWT', () => {
    const email = 'test@example.com';
    const password = 'password';
    const accessToken = 'access_token';
    const refreshToken = 'refresh_token';

    service.login(email, password).subscribe((response) => {
      expect(localStorage.getItem('accessToken')).toBe(accessToken);
      expect(localStorage.getItem('refreshToken')).toBe(refreshToken);
    });

    const op = apolloController.expectOne(service.LOGIN_MUTATION);
    op.flush({data: {authLogin: {accessToken, refreshToken}}});
  });

  it('should check if the user is authenticated', () => {
    localStorage.removeItem('accessToken');
    expect(service.isAuthenticated()).toBe(false);

    localStorage.setItem('accessToken', 'access_token');
    expect(service.isAuthenticated()).toBe(true);
  });
});
