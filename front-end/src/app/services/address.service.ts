import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {Address, Country} from "../entities/address.entity";
import {CreateAddressDto} from "../Dto/create-address.dto";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  readonly GET_COUNTRIES = gql`
    query GetCountries {
      countries {
        id
        name
        code
      }
    }
  `;
  readonly CREATE_ADDRESS = gql`
    mutation CreateAddress($input: CreateAddressDto!) {
      createAddress(createAddressInput: $input) {
        id
        country {
        id
          name
          code
        }
        line1
        unitNumber
        city
        postalCode
      }
    }
  `;
  readonly GET_ADDRESSES = gql`
    query getAddresses{
      addresses {
        id
        country {
        id
          name
          code
        }
        line1
        unitNumber
        city
        postalCode
      }
    }

  `

  constructor(private apollo: Apollo) {
  }

  getCountries() {
    return this.apollo.watchQuery<{ countries: Country[] }>({
      query: this.GET_COUNTRIES,
    }).valueChanges;
  }

  createAddress(input: CreateAddressDto): Observable<Address> {
    return this.apollo.mutate<{ createAddress: Address }>({
      mutation: this.CREATE_ADDRESS,
      variables: {input}, // @ts-ignore
    }).pipe(map(value => value.data.createAddress));
  }

  getAddresses(): Observable<Address[]> {
    return this.apollo.watchQuery<{
      addresses: Address[]
    }>({query: this.GET_ADDRESSES, fetchPolicy: "network-only"}).valueChanges.pipe(map(result => {
      return result.data.addresses
    }))
  }
}
