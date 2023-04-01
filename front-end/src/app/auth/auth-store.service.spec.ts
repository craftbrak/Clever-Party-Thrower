import {TestBed} from '@angular/core/testing';
import {AuthStoreService} from "./auth-store.service";

describe('AuthStoreService', () => {
  let mySingletonService: AuthStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthStoreService,
      ],
    });
    mySingletonService = TestBed.inject(AuthStoreService);
    localStorage.removeItem('myData');
  });

  it('should be created', () => {
    expect(mySingletonService).toBeTruthy();
  });

  it('should store authToken in localStorage', () => {
    const newData = {foo: 'bar'};
    mySingletonService.authToken = newData.foo;
    // @ts-ignore
    expect(JSON.parse(localStorage.getItem('authToken'))).toEqual(newData);
  });

  it('should retrieve authToken from localStorage', () => {
    const storedData = {foo: 'bar'};
    expect(mySingletonService.authToken).toEqual(storedData.foo);
  });

  it('should store refreshToken in localStorage', () => {
    const newData = {foo: 'bar'};
    mySingletonService.refreshToken = newData.foo;
    // @ts-ignore
    expect(JSON.parse(localStorage.getItem('refreshToken'))).toEqual(newData);
  });

  it('should retrieve authToken from localStorage', () => {
    const storedData = {foo: 'bar'};
    localStorage.setItem('refreshToken', JSON.stringify(storedData));
    expect(mySingletonService.refreshToken).toEqual(storedData.foo);
  });
});
