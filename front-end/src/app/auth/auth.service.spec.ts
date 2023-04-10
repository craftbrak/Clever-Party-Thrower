import {TestBed} from '@angular/core/testing';
import {AuthService} from './auth.service';
import {ApolloTestingController, ApolloTestingModule} from 'apollo-angular/testing';
import {of} from "rxjs";
import {Apollo} from "apollo-angular";

describe('AuthService', () => {
  let service: AuthService;
  let apolloController: ApolloTestingController;
  let apollo: Apollo;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [Apollo],
    });
    service = TestBed.inject(AuthService);
    apolloController = TestBed.inject(ApolloTestingController);
    apollo = TestBed.inject(Apollo);
    // @ts-ignore
    spyOn(apollo, 'mutate').and.returnValue(of({}));
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
      // expect(localStorage.getItem('refreshToken')).toBe(refreshToken);
    });

    // const op = apolloController.expectOne(service.LOGIN_MUTATION);
    // op.flush({data: {authLogin: {accessToken, refreshToken}}});
  });

  it('should check if the user is authenticated', () => {
    localStorage.removeItem('accessToken');
    expect(service.isAuthenticated()).toBe(false);

    localStorage.setItem('accessToken', 'access_token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should call register mutation', (done) => {
    const registerResponse = {
      data: {
        createUser: {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      },
    };

    // @ts-ignore
    apollo.mutate.and.returnValue(of(registerResponse));

    service
      .register('John Doe', 'john.doe@example.com', 'password123', true, true, '123 Main St', "")
      .subscribe((response) => {
        expect(response).toEqual(registerResponse);
        done();
      });

    expect(apollo.mutate).toHaveBeenCalled();
  });
});
