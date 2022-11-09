import {IntegrationTestManager} from "../../integration-test-manager";
import {Car} from "../../../car/entities/car.entity";
import gql from "graphql-tag";
import request from "supertest-graphql";
import {CarMock} from "../../mock/car.mock";
import {Carpool} from "../../../carpool/entities/carpool.entity";

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
            console.log(integrationTestManager.accessToken);
            beforeAll(async () => {
                const querry = gql`
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
                        }
                    }
                `;
                const response = await request<{ createCarpool: Carpool }>(
                    integrationTestManager.httpServer,
                )
                    .set({
                        Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
                    })
                    .mutate(querry)
                    .variables({
                        createCarpoolDto: {
                            ...CarMock,
                        },
                    })
                    .expectNoErrors();
                createdCarpool = response.data.createCarpool;
            });
            test("Then the response should be the created Carpool", () => {
                console.table(createdCarpool);
                expect(createdCarpool).toMatchObject({
                    ...CarMock,
                });
            });
            test("Then the carpool should have an id", async () => {
                expect(createdCarpool.id).toBeTruthy();
            });
            test("Then the carpool should have an start address", async () => {
                expect(createdCarpool.startDestination.id).toEqual(integrationTestManager.testAddress.id);
            });
            test("Then the carpool should have an ending address", async () => {
                expect(createdCarpool.finalDestination.id).toEqual(integrationTestManager.testAddress.id);
            });
            test("Then the carpool should have an driver", async () => {
                expect(createdCarpool.driver.id).toEqual(integrationTestManager.testUser.id);
            });
            test("Then the carpool should have an event", async () => {
                expect(createdCarpool.driver.id).toEqual(integrationTestManager.testUser.id);
            });
            test("Then the carpool should have an car", async () => {
                expect(createdCarpool.driver.id).toEqual(integrationTestManager.testUser.id);
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