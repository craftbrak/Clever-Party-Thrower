import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import jwt_decode from "jwt-decode";
import {catchError, map, Observable, tap, throwError} from "rxjs";
import gql from "graphql-tag";
import {JWTPayload} from "../entities/JWTPayload.entity";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public LOGIN_MUTATION = gql`
    mutation AuthLogin($AuthinputDto: AuthInputDto!) {
      authLogin(authInputDto: $AuthinputDto) {
        accessToken
        refreshToken
        invalidCredentials
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
  public REFRESH_Mutuation = gql`
    mutation RefreshTokens($input: AuthRefreshDto!){
      authRefresh(AuthRefreshDto: $input ){
        accessToken
        refreshToken
      }
    }
  `
  public user: JWTPayload | null = null;
  public tokenTTL: number = 1000
  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;

  constructor(private apollo: Apollo) {
    this.getToken()
    if (this._accessToken) {
      this.user = jwt_decode(this._accessToken)

      // @ts-ignore
      this.tokenTTL = this.user.exp - this.user?.iat
      console.log(this.tokenTTL)
    }
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
      map(({data}) => {
        if (data && data.authLogin) {
          const {accessToken, refreshToken, invalidCredentials} = data.authLogin;
          if (!invalidCredentials) {
            this.setTokens(accessToken, refreshToken)
            return true
          }
        }
        return false
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

  public refreshTokens(): void {
    console.info("refresshing Token")

    this.apollo.mutate({
      mutation: this.REFRESH_Mutuation, variables: {input: {refreshToken: localStorage.getItem('refreshToken')}}
    }).pipe(// @ts-ignore
      tap(({data}) => {
        if (data && data.authRefresh) {
          const {accessToken, refreshToken} = data.authRefresh;
          this.setTokens(accessToken, refreshToken)
        }
      }),
      catchError((error) => {
        // Handle errors, e.g., show an error message
        console.error('Login error:', error);
        return throwError(error);
      })
    ).subscribe(); // Add this line
  }


  private validateToken() {

  }

  private setTokens(accessToken: string, refreshToken: string) {
    console.debug("setting tokens")
    console.log(accessToken, refreshToken)
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
    localStorage.setItem('accessToken', this._accessToken ?? '');
    localStorage.setItem('refreshToken', this._refreshToken ?? '');
    if (accessToken.length > 0) this.user = jwt_decode(accessToken)
    // @ts-ignore
    localStorage.setItem('userid', this.user?.id)
  }
}
