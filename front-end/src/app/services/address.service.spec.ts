import {TestBed} from '@angular/core/testing';

import {AddressService} from './address.service';
import {Apollo} from "apollo-angular";
import {ApolloTestingController, ApolloTestingModule} from "apollo-angular/testing";
import {of} from "rxjs";

describe('AddressService', () => {
  let service: AddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [Apollo],
    });
    service = TestBed.inject(AddressService);
    let apolloController = TestBed.inject(ApolloTestingController);
    let apollo = TestBed.inject(Apollo);
    // @ts-ignore
    spyOn(apollo, 'mutate').and.returnValue(of({}));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
