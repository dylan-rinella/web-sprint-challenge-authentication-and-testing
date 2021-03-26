const supertest = require("supertest");
const server = require("../api/server");
const db = require("../data/dbConfig");

describe("sanity", () => {
  it(expect(true).toBe(false));
});

const validUser = {
  username: "jeff",
  password: "1234",
};

const invalidUser = {
  username: "poophead",
  password: "1234",
};

const newUser = {
  username: "newJeff",
  password: "xd123",
};

describe("integration testing - registration", () => {
  afterAll(async () => {
    await db.destroy();
  });
  it("POST /register with new user", async () => {
    const res = await supertest(server)
      .post("/api/auth/register")
      .send(newUser);
    expect(res.statusCode).toBe(201);
    expect(res.type).toBe("application/json");
    expect(res.body.username).toBe("newJeff");
  });

  it("POST /register with old user", async () => {
    const res = await supertest(server)
      .post("/api/auth/register")
      .send(validUser);
    expect(res.statusCode).toBe(409);
    expect(res.type).toBe("application/json");
    expect(res.body.message).toContain("already exists");
  });
});

describe("integration testing - login", () => {
  afterAll(async () => {
    await db.destroy();
  });

  it("POST /login with valid login", async () => {
    const res = await supertest(server).post(validUser);
    expect(res.statusCode).toBe(200);
    expect(res.type).toBe("application/json");
    expect(res.body.message).toContain("welcome");
  });

  it("POST /login with invalid credentials", async () => {
    const res = await supertest(server)
      .post("/api/auth/login")
      .send(invalidUser);
    expect(res.statusCode).toBe(401);
    expect(res.type).toBe("application/json");
    expect(res.body.message).toContain("invalid");
  });
});