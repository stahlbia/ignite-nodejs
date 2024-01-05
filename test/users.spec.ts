import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "child_process";

describe("Users routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync("npm run knex migrate:rollback --all");
    execSync("npm run knex migrate:latest");
  });

  it("should be able to create a new user", async () => {
    await request(app.server)
      .post("/users/create")
      .send({
        username: "test_user",
        password: "password12345",
        email: "test_user@gmail.com",
        name: "Test User",
      })
      .expect(201);
  });

  it("should be able to login with a user", async () => {
    await request(app.server).post("/users/create").send({
      username: "test_user",
      password: "password12345",
      email: "test_user@gmail.com",
      name: "Test User",
    });

    const response = await request(app.server).post("/users/login").send({
      username: "test_user",
      password: "password12345",
    });

    const cookies = response.get("Set-Cookie");

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining("userId")]),
    );
  });
});
