import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { Carpool } from "../../../carpool/entities/carpool.entity";
import { CarpoolMock } from "../../mock/carpool.mock";
import { CreateCarpoolDto } from "../../../carpool/dto/create-carpool.dto";

describe("createCarpool", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the carpool doesn't already exist", () => {
    describe("When a new carpool is registered ", () => {
      let createdCarpool: Carpool;
      let carpoolMock: CreateCarpoolDto;

      beforeAll(async () => {
        const startAdd = await integrationTestManager.getNewAddress();
        const endAdd = await integrationTestManager.getNewAddress();
        const driver = await integrationTestManager.getNewUser();
        const car = await integrationTestManager.getNewCar();
        const event = await integrationTestManager.getNewEvent();
        carpoolMock = CarpoolMock(
          startAdd.id,
          endAdd.id,
          driver.id,
          car.id,
          event.id,
        );
        const query = gql`
          mutation CreateCarPool($createCarpoolDto: CreateCarpoolDto!) {
            createCarpool(createCarpoolInput: $createCarpoolDto) {
              id
              startDestination {
                id
              }
              finalDestination {
                id
              }
              car {
                id
              }
              direction
              totalLength
              driver {
                id
              }
              event {
                id
              }
              departure
              arrival
            }
          }
        `;
        const response = await request<{ createCarpool: Carpool }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .mutate(query)
          .variables({
            createCarpoolDto: {
              ...carpoolMock,
            },
          })
          .expectNoErrors();
        createdCarpool = response.data.createCarpool;
      });
      test("Then the response should be the created Carpool", () => {});
      test("Then the carpool should have an id", async () => {
        expect(createdCarpool.id).toBeTruthy();
      });
      test("Then the carpool should have an start address", async () => {
        expect(createdCarpool.startDestination.id).toEqual(
          carpoolMock.startDestinationId,
        );
      });
      test("Then the carpool should have an ending address", async () => {
        expect(createdCarpool.finalDestination.id).toEqual(
          carpoolMock.finalDestinationId,
        );
      });
      test("Then the carpool should have an driver", async () => {
        expect(createdCarpool.driver.id).toEqual(carpoolMock.driverId);
      });
      test("Then the carpool should have an event", async () => {
        expect(createdCarpool.event.id).toEqual(carpoolMock.eventId);
      });
      test("Then the carpool should have an car", async () => {
        expect(createdCarpool.car.id).toEqual(carpoolMock.carId);
      });
      test("Then the carpool should be in the database", async () => {
        const carpool = await integrationTestManager.dataSource
          .getRepository(Carpool)
          .findOneByOrFail({ id: createdCarpool.id });
        expect(carpool).toBeDefined();
      });
    });
  });
});
