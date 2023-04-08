import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { Carpool } from "../../../carpool/entities/carpool.entity";

describe("queryCarpool", () => {
  jest.setTimeout(90000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the Carpool exists", () => {
    let existingCarpool: Carpool;
    beforeAll(async () => {
      existingCarpool = await integrationTestManager.getNewCarpool(); //todo: Create Routes and test fieldResolver
    });

    describe("When querying a carpool by its ID", () => {
      let queriedCarpool: Carpool;
      beforeAll(async () => {
        const query = gql`
          query GetCarpool($carpoolId: String!) {
            carpool(id: $carpoolId) {
              id
              driver {
                id
              }
              routes {
                id
              }
              direction
              endPoint {
                id
              }
              startPoint {
                id
              }
              car {
                id
              }
              event {
                id
              }
              totalLength
              departure
              arrival
            }
          }
        `;
        const response = await request<{ carpool: Carpool }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .query(query)
          .variables({ carpoolId: existingCarpool.id })
          .expectNoErrors();
        queriedCarpool = response.data.carpool;
      });

      test("Then the response should be the queried Carpool", () => {
        expect(queriedCarpool).toMatchObject({
          id: existingCarpool.id,
          driver: {
            id: existingCarpool.driver.id,
          },
          direction: existingCarpool.direction,
          endPoint: {
            id: existingCarpool.endPoint.id,
          },
          startPoint: {
            id: existingCarpool.startPoint.id,
          },
          car: {
            id: existingCarpool.car.id,
          },
          event: {
            id: existingCarpool.event.id,
          },
          totalLength: existingCarpool.totalLength,
          departure: existingCarpool.departure.toISOString(),
          arrival: existingCarpool.arrival.toISOString(),
        });
        // console.dir(queriedCarpool);
        // console.log(queriedCarpool.routes.length);
        // expect(queriedCarpool.routes).toHaveLength(
        //   existingCarpool.routes.length,
        // );
        // existingCarpool.routes.forEach((route, index) => {
        //   expect(queriedCarpool.routes[index].id).toBe(route.id);
        // });
      });
    });
  });
});
