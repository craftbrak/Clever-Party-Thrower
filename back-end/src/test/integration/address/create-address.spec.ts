import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { Address } from "../../../address/entities/address.entity";
import { addressMock } from "../../mock/address.mock";

describe("createAddress", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the address doesn't already exist", () => {
    describe("When a new address is registered ", () => {
      let createdAddress: Address;

      beforeAll(async () => {
        const querry = gql`
          mutation CreateAddress($createAddressData: CreateAddressDto!) {
            createAddress(createAddressInput: $createAddressData) {
              id
              streetNumber
              city
              country {
                id
                name
                code
              }
              countryId
              postalCode
              line1
              line2
              unitNumber
            }
          }
        `;
        const response = await request<{ createAddress: Address }>(
          integrationTestManager.httpServer,
        )
          .mutate(querry)
          .variables({
            createAddressData: {
              ...addressMock,
              countryId: integrationTestManager.testCountry.id,
            },
          })
          .expectNoErrors();
        createdAddress = response.data.createAddress;
      });
      test("Then the response should be the created Address", () => {
        // console.table(createdAddress);
        expect(createdAddress).toMatchObject({
          ...addressMock,
          countryId: integrationTestManager.testCountry.id,
        });
      });
      test("Then the address should have an id", async () => {
        expect(createdAddress.id).toBeTruthy();
      });
      test("Then the address should not have an country", async () => {
        expect(createdAddress.countryId).toEqual(
          integrationTestManager.testCountry.id,
        );
        expect(createdAddress.country).toMatchObject({
          id: integrationTestManager.testCountry.id,
          name: integrationTestManager.testCountry.name,
          code: integrationTestManager.testCountry.code,
        });
      });
      test("Then the user should be in the database", async () => {
        const address = await integrationTestManager.dataSource
          .getRepository(Address)
          .findOneByOrFail({ id: createdAddress.id });
        expect(address).toBeDefined();
      });
    });
  });
});
