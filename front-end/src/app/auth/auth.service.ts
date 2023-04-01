import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import jwt_decode from "jwt-decode";
import {catchError, tap, throwError} from "rxjs";
import gql from "graphql-tag";
import {AuthStoreService} from "./auth-store.service";


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
  private _accessToken: string | undefined;
  private _refreshToken: string | undefined;

  constructor(private apollo: Apollo, private authStore: AuthStoreService) {
  }

  public async getToken(): Promise<string> {
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
          this.authStore.authToken = accessToken;
          this.authStore.refreshToken = refreshToken;
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
    const accessToken = this.authStore.authToken

    return accessToken !== null;
  }

  public async logout() {
  };

  public async signIn() {
  };

  public async deleteAccount() {
  };

  private validateToken() {

  }

  private async refreshTokens() {

  }
}
