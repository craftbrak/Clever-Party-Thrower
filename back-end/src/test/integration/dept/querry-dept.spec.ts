import { Dept } from "../../../dept/entities/dept.entity";
import { IntegrationTestManager } from "../../integration-test-manager";
import gql from "graphql-tag";
import request from "supertest-graphql";

describe("queryDept", () => {
  jest.setTimeout(90000);
  const integrationTestManager = new IntegrationTestManager();
  beforeAll(async () => {
    await integrationTestManager.beforeAll();
  });
  afterAll(async () => {
    await integrationTestManager.afterAll();
  });

  describe("Given that the Dept exists", () => {
    let existingDept: Dept;
    beforeAll(async () => {
      existingDept = await integrationTestManager.getNewDept();
    });

    describe("When querying a dept by its ID", () => {
      let queriedDept: Dept;
      beforeAll(async () => {
        const query = gql`
          query GetDept($deptId: String!) {
            dept(id: $deptId) {
              id
              amount
              repayed
              debtor {
                id
              }
              creditor {
                id
              }
              event {
                id
              }
            }
          }
        `;
        const response = await request<{ dept: Dept }>(
          integrationTestManager.httpServer,
        )
          .set({
            Authorization: `Bearer ${integrationTestManager.accessToken.accessToken}`,
          })
          .query(query)
          .variables({ deptId: existingDept.id })
          .expectNoErrors();
        queriedDept = response.data.dept;
      });

      test("Then the response should be the queried Dept", () => {
        expect(queriedDept).toMatchObject({
          id: existingDept.id,
          amount: existingDept.amount,
          repayed: existingDept.repayed,
          debtor: { id: existingDept.debtor.id },
          creditor: { id: existingDept.creditor.id },
          event: { id: existingDept.event.id },
        });
      });
    });
  });
});
