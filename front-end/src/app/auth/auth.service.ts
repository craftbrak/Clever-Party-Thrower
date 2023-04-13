import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import jwt_decode from "jwt-decode";
import {catchError, Observable, tap, throwError} from "rxjs";
import gql from "graphql-tag";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public LOGIN_MUTATION = gql`
    mutation AuthLogin($AuthinputDto: AuthInputDto!) {
      authLogin(authInputDto: $AuthinputDto) {
        accessToken
        refreshToken
      }
    }
  `;
  public REGISTER_MUTATION = gql`
    mutation CreateUser($singUp: CreateUserDto!) {
      createUser(singUp: $singUp) {
        name
        id
      }
    }
  `;
  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;

  constructor(private apollo: Apollo) {
  }

  public async getToken(): Promise<string> {
    this._accessToken = localStorage.getItem('accessToken');
    this._refreshToken = localStorage.getItem('refreshToken');
    if (this._accessToken && this._refreshToken) {
      // @ts-ignore
      const {exp} = jwt_decode(this._accessToken)
      if (Date.now() >= exp * 1000) {
        // @ts-ignore
        const {expr} = jwt_decode(this._refreshToken)
        if (Date.now() >= expr * 1000) {
          await this.refreshTokens()
          return this._accessToken

        }
      }
      return this._accessToken;
    }
    return "";
  }

  public login(email: string, password: string) {

    return this.apollo.mutate({
      mutation: this.LOGIN_MUTATION,
      variables: {
        AuthinputDto: {
          email,
          password,
        },
      },
    }).pipe(
      // @ts-ignore
      tap(({data}) => {
        if (data && data.authLogin) {
          const {accessToken, refreshToken} = data.authLogin;
          this._accessToken = accessToken;
          this._refreshToken = refreshToken;
          localStorage.setItem('accessToken', this._accessToken ? this._accessToken : '');
          localStorage.setItem('refreshToken', this._refreshToken ? this._refreshToken : '');
        }
      }),
      catchError((error) => {
        // Handle errors, e.g., show an error message
        console.error('Login error:', error);
        return throwError(error);
      })
    );
  }

  public isAuthenticated(): boolean {
    let accessToken = this._accessToken = localStorage.getItem('accessToken');
    return accessToken !== null;
  }

  public async logout() {
  };

  public register(
    name: string,
    email: string,
    password: string,
    drivingLicence: boolean,
    manual: boolean,
    addressId: string,
    avatar: string
  ): Observable<any> {
    let singUp = {
      addressId: addressId,
      drivingLicence: drivingLicence,
      email: email,
      manual: manual,
      name: name,
      password: password,
    }
    return this.apollo.mutate({
      mutation: this.REGISTER_MUTATION,
      variables: {singUp},
    });

  }

  public async deleteAccount() {
  };

  public refreshTokens() {
    // let resp : AuthOutputDto;
    // this._refreshToken = resp.refreshToken;
    // this._accessToken = resp.accessToken;
    // localStorage.setItem('accessToken', JSON.stringify(this._accessToken));
    // localStorage.setItem('refreshToken', JSON.stringify(this._refreshToken));
  }

  private validateToken() {

  }
}
