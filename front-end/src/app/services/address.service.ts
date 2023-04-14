import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {Address, Country} from "../entities/address.entity";
import {CreateAddressDto} from "../Dto/create-address.dto";

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

  createAddress(input: CreateAddressDto) {
    return this.apollo.mutate<Address>({
      mutation: this.CREATE_ADDRESS,
      variables: {input},
    });
  }

  getAddresses() {
    return this.apollo.watchQuery<{ addresses: Address[] }>({query: this.GET_ADDRESSES}).valueChanges
  }
}
