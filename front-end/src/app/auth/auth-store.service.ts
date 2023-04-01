import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {


  private static instance: AuthStoreService;

  constructor() {
    const storedAuthToken = localStorage.getItem('authToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedAuthToken) {
      this._authToken = JSON.parse(storedAuthToken);
    }
    if (storedRefreshToken) {
      this._refreshToken = JSON.parse(storedRefreshToken)
    }
  }

  private _authToken: string | undefined;

  get authToken(): string | undefined {
    return this._authToken;
  }

  set authToken(value: string | undefined) {
    this._authToken = value;
    localStorage.setItem('refreshToken', JSON.stringify(this._authToken));
  }

  private _refreshToken: string | undefined;

  get refreshToken(): string | undefined {
    return this._refreshToken;
  }

  set refreshToken(value: string | undefined) {
    this._refreshToken = value;
    localStorage.setItem('refreshToken', JSON.stringify(this._refreshToken));
  }

  public static getInstance(): AuthStoreService {
    if (!AuthStoreService.instance) {
      AuthStoreService.instance = new AuthStoreService();
      // @ts-ignore
      window['AuthStoreService'] = AuthStoreService.instance;
    }
    return AuthStoreService.instance;
  }
}
