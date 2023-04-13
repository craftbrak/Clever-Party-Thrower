import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { Address } from "../../../address/entities/address.entity";

describe("queryAddress", () => {
  jest.setTimeout(80000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the Address exists", () => {
    let existingAddress: Address;
    beforeAll(async () => {
      existingAddress = await integrationTestManager.getNewAddress(
        integrationTestManager.testUser,
      );
    });

    describe("When querying an address by its ID", () => {
      let queriedAddress: Address;
      beforeAll(async () => {
        const query = gql`
          query GetAddress($addressId: String!) {
            address(id: $addressId) {
              id
              line1
              unitNumber
              city
              postalCode
              countryId
              country {
                id
              }
              ownerId
              owner {
                id
              }
            }
          }
        `;
        const response = await request<{ address: Address }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .query(query)
          .variables({ addressId: existingAddress.id })
          .expectNoErrors();
        queriedAddress = response.data.address;
      });

      test("Then the response should be the queried Address", () => {
        expect(queriedAddress).toMatchObject({
          id: existingAddress.id,
          city: existingAddress.city,
          postalCode: existingAddress.postalCode,
          line1: existingAddress.line1,
          unitNumber: existingAddress.unitNumber,
          countryId: existingAddress.country.id,
          country: { id: existingAddress.countryId },
          ownerId: existingAddress.ownerId,
          owner: { id: existingAddress.ownerId },
          // Include any other fields you want to compare
        });
      });
    });
  });
});
