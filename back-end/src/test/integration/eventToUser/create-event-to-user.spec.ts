import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";
import {
  EventToUser,
  UserRole,
} from "../../../event-to-user/entities/event-to-user.entity";
import { CreateEventToUserDto } from "../../../event-to-user/dto/create-event-to-user.dto";
import { EventToUserMock } from "../../mock/eventToUser.mock";

describe("createEventToUser", () => {
  jest.setTimeout(20000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the eventToUser doesn't already exist", () => {
    describe("When a new eventToUser is registered ", () => {
      let createdEventToUser: EventToUser;
      let eventToUserMock: CreateEventToUserDto;

      console.log(integrationTestManager.accessToken);
      beforeAll(async () => {
        const address = await integrationTestManager.getNewAddress();
        const user = await integrationTestManager.getNewUser();
        const event = await integrationTestManager.getNewEvent();
        eventToUserMock = EventToUserMock(event, user, address);
        const query = gql`
          mutation CreateCarPool($createEventToUserDto: CreateEventToUserDto!) {
            createEventToUser(createEventToUserInput: $createEventToUserDto) {
              id
              address {
                id
              }
              role
              user {
                id
              }
              event {
                id
              }
            }
          }
        `;
        const response = await request<{ createEventToUser: EventToUser }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .mutate(query)
          .variables({
            createEventToUserDto: {
              ...eventToUserMock,
            },
          })
          .expectNoErrors();
        createdEventToUser = response.data.createEventToUser;
      });
      test("Then the response should be the created eventToUser", () => {
        console.table(createdEventToUser);
        expect(createdEventToUser).toMatchObject({
          role: "INVITED",
          address: {
            id: eventToUserMock.addressId,
          },
          event: {
            id: eventToUserMock.eventId,
          },
          user: {
            id: eventToUserMock.userId,
          },
        });
      });
      test("Then the eventToUser should have an id", async () => {
        expect(createdEventToUser.id).toBeTruthy();
      });
      test("Then the eventToUser should have an start address", async () => {
        expect(createdEventToUser.address.id).toEqual(
          eventToUserMock.addressId,
        );
      });
      test("Then the eventToUser should have an user", async () => {
        expect(createdEventToUser.user.id).toEqual(eventToUserMock.userId);
      });
      test("Then the eventToUser should have an event", async () => {
        expect(createdEventToUser.event.id).toEqual(eventToUserMock.eventId);
      });
      test("Then the eventToUser should have an car", async () => {
        expect(createdEventToUser.role).toEqual(UserRole.INVITED);
      });
      test("Then the eventToUser should be in the database", async () => {
        const carpool = await integrationTestManager.dataSource
          .getRepository(EventToUser)
          .findOneByOrFail({ id: createdEventToUser.id });
        expect(carpool).toBeDefined();
      });
    });
  });
});
