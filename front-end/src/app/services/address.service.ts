import {Injectable} from '@angular/core';
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";
import {Country} from "../entities/address.entity";
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
      }
    }
  `;

  constructor(private apollo: Apollo) {
  }

  getCountries() {
    return this.apollo.watchQuery<{ countries: Country[] }>({
      query: this.GET_COUNTRIES,
    }).valueChanges;
  }

  createAddress(input: CreateAddressDto) {
    return this.apollo.mutate({
      mutation: this.CREATE_ADDRESS,
      variables: {input},
    });
  }
}
