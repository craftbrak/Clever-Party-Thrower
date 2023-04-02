import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import jwt_decode from "jwt-decode";
import {catchError, Observable, tap, throwError} from "rxjs";
import gql from "graphql-tag";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  LOGIN_MUTATION = gql`
    mutation AuthLogin($AuthinputDto: AuthInputDto!) {
      authLogin(authInputDto: $AuthinputDto) {
        accessToken
        refreshToken
      }
    }
  `;
  REGISTER_MUTATION = gql`
    mutation Register(
      $name: String!
      $email: String!
      $password: String!
      $drivingLicence: Boolean!
      $manual: Boolean!
      $address: String!
    ) {
      createUser(
        singUp: {
          name: $name
          email: $email
          password: $password
          drivingLicence: $drivingLicence
          manual: $manual
          addressId: $address
        }
      ) {
        id
        name
        email
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
          localStorage.setItem('accessToken', JSON.stringify(this._accessToken));
          localStorage.setItem('refreshToken', JSON.stringify(this._refreshToken));
          this._accessToken = accessToken;
          this._refreshToken = refreshToken;
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
    let accessToken
    this.getToken().then(token => accessToken = token);
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
    address: string
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: this.REGISTER_MUTATION,
      variables: {
        name,
        email,
        password,
        drivingLicence,
        manual,
        address,
      },
    });
  }

  public async deleteAccount() {
  };

  private validateToken() {

  }

  private async refreshTokens() {
    // let resp : AuthOutputDto;
    // this._refreshToken = resp.refreshToken;
    // this._accessToken = resp.accessToken;
    // localStorage.setItem('accessToken', JSON.stringify(this._accessToken));
    // localStorage.setItem('refreshToken', JSON.stringify(this._refreshToken));
  }
}
