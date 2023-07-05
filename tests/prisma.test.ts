import { prismaMock } from "../mocks/prisma";

describe("example test with Prisma Client", () => {
  beforeAll(async () => {
    await prismaMock.$connect();
  });

  afterAll(async () => {
    await prismaMock.$disconnect();
  });

  test("test query", async () => {
    const data = await prismaMock.user;

    expect(data).toBeTruthy();
  });
});
