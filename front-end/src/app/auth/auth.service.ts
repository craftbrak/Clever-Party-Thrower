import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import jwt_decode from "jwt-decode";
import gql from "graphql-tag";
import {AuthOutputDto} from "../Dto/auth-output.dto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _accessToken: string | undefined;
  private _refreshToken: string | undefined;

  constructor(private apollo: Apollo) {
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

  public async login(usrname: string, passwword: string) {
    const loginGql = gql`
      mutation AuthLogin($AuthinputDto: AuthInputDto! ){
        authLogin(authInputDto: $AuthinputDto){
          accessToken
          refreshToken
        }
      }
    `
    this.apollo.mutate<Observable<AuthOutputDto>>({mutation: loginGql, variables: {}}).subscribe((result) => {
        console.log('got data', result);
      },
      error => {
        console.log('there was an error sending the query', error);
      },)
  };

  public async logout() {
  };

  public async signIn() {
  };

  public async deleteAccount() {
  };

  private async refreshTokens() {

  }

}
