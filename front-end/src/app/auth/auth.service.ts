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
  private _accessToken: string | null = '';
  private _refreshToken: string | null = null;

  constructor(private apollo: Apollo) {
    this.getToken()
    if (this._accessToken) {
      // console.log(this._accessToken)
      this.setUser()

      // @ts-ignore
      this.tokenTTL = this.user.exp - this.user?.iat
      // console.log(this.tokenTTL)
    }
  }

  public async getToken() {
    this._accessToken = localStorage.getItem('accessToken');
    this._refreshToken = localStorage.getItem('refreshToken');
    this.setUser()
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
            this.setUser()
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
    this.user = null;
    // @ts-ignore
    localStorage.setItem("accessToken", "");
    // @ts-ignore
    localStorage.setItem("refreshToken", "");
    this._accessToken = null
    this._refreshToken = null
    window.location.href = '/login';
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
      avatar: avatar
    }
    console.table(singUp)
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
          this.setUser()
        }
      }),
      catchError((error) => {
        // Handle errors, e.g., show an error message
        console.error('Login error:', error);
        return throwError(error);
      })
    ).subscribe();
  }


  updateUser(userData: {
    id: string
    name?: string,
    email?: string,
    password?: string,
    addressId?: string,
    avatar?: string,
    dirivinglicence?: boolean,
    manual?: boolean
  }) {
    const mut = gql`
      mutation UpdateUser($updateUserInput: UpdateUserDto!) {
        updateUser(updateUserInput: $updateUserInput) {
          id
        }
      }
    `
    return this.apollo.mutate({
      mutation: mut, variables: {
        updateUserInput: {
          addressId: userData.addressId,
          id: userData.id,
          avatar: userData.avatar,
          drivingLicence: userData.dirivinglicence,
          email: userData.email,
          manual: userData.manual,
          name: userData.name,
          password: userData.password
        }
      }
    })
  }

  setUser() {
    if (this._accessToken != null) {
      // console.log("user created")
      this.user = jwt_decode(this._accessToken)
      // console.log(this.user)
    }
  }

  setTokens(accessToken: string, refreshToken: string) {
    this._accessToken = accessToken;
    this._refreshToken = refreshToken;
    localStorage.setItem('accessToken', this._accessToken ?? '');
    localStorage.setItem('refreshToken', this._refreshToken ?? '');
    if (accessToken.length > 0) this.user = jwt_decode(accessToken)
    localStorage.setItem('userid', this.user?.id!)
  }

  sendVerifyEmail() {
    const mut = gql`
    mutation Mutation {
      requestEmailVerification
    }
    `
    this.apollo.mutate({mutation: mut})
  }

  verifyUser(token: string) {
    const mut = gql`
    mutation VerifyEmail($verifyEmailDto: VerifyEmailDto!) {
      verifyEmail(VerifyEmailDTO: $verifyEmailDto)
    }
`

    return this.apollo.mutate<Observable<boolean>>({
      mutation: mut, variables: {
        verifyEmailDto: {
          verificationToken: token
        }
      }// @ts-ignore
    }).pipe(map(value => value.data.verifyEmail))
  }
}
