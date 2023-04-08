import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import { Car } from "../../../car/entities/car.entity";

describe("queryCar", () => {
    jest.setTimeout(80000);
    const integrationTestManager = new IntegrationTestManager();
    beforeAll(async () => {
        await integrationTestManager.beforeAll();
    });
    afterAll(async () => {
        await integrationTestManager.afterAll();
    });

    describe("Given that the Car exists", () => {
        let existingCar: Car;
        beforeAll(async () => {
            existingCar = await integrationTestManager.getNewCar();
        });

        describe("When querying a car by its ID", () => {
            let queriedCar: Car;
            beforeAll(async () => {
                const query = gql`
                    query GetCar($carId: String!) {
                        car(id: $carId) {
                            id
                            brand
                            model
                            consumption
                            bootSize
                            fuel
                            manualTransmission
                            range
                            shared
                            ownerId
                            owner {
                                id
                            }
                        }
                    }
                `;
                const response = await request<{ car: Car }>(
                    integrationTestManager.httpServer,
                )
                    .set({
                        Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
                    })
                    .query(query)
                    .variables({carId: existingCar.id})
                    .expectNoErrors();
                queriedCar = response.data.car;
            });

            test("Then the response should be the queried Car", () => {
                expect(queriedCar).toMatchObject({
                    id: existingCar.id,
                    brand: existingCar.brand,
                    model: existingCar.model,
                    consumption: existingCar.consumption,
                    bootSize: existingCar.bootSize,
                    fuel: existingCar.fuel,
                    manualTransmission: existingCar.manualTransmission,
                    range: existingCar.range,
                    shared: existingCar.shared,
                    ownerId: existingCar.ownerId,
                    owner: {id: existingCar.ownerId},
                });
            });
        )

        });
    });
