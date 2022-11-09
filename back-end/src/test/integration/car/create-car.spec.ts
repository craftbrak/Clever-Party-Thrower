import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { Car } from "../../../car/entities/car.entity";
import { CarMock } from "../../mock/car.mock";

describe("createCar", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the car doesn't already exist", () => {
    describe("When a new car is registered ", () => {
      let createdCar: Car;
      console.log(integrationTestManager.accessToken);
      beforeAll(async () => {
        const querry = gql`
          mutation CreateEvent($createCarDto: CreateCarDto!) {
            createCar(createCarInput: $createCarDto) {
              id
              bootSize
              brand
              consumption
              fuel
              manualTransmission
              maxPassengers
              model
              range
              owner {
                id
              }
            }
          }
        `;
        const response = await request<{ createCar: Car }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .mutate(querry)
          .variables({
            createCarDto: {
              ...CarMock,
            },
          })
          .expectNoErrors();
        createdCar = response.data.createCar;
      });
      test("Then the response should be the created Car", () => {
        console.table(createdCar);
        expect(createdCar).toMatchObject({
          ...CarMock,
        });
      });
      test("Then the car should have an id", async () => {
        expect(createdCar.id).toBeTruthy();
      });
      test("Then the car should have an owner", async () => {
        expect(createdCar.owner.id).toEqual(integrationTestManager.testUser.id);
      });
      test("Then the car should be in the database", async () => {
        const car = await integrationTestManager.dataSource
          .getRepository(Car)
          .findOneByOrFail({ id: createdCar.id });
        expect(car).toBeDefined();
      });
    });
  });
});
