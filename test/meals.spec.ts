import { it, beforeAll, afterAll, describe, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { execSync } from "child_process";

describe("Meals routes", () => {
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

  it("should be able to register a meal", async () => {
    await createUser();
    const cookie = await loginUser();

    await createMeal(cookie);
  });

  it("should be able to edit a meal", async () => {
    await createUser();
    const cookie = await loginUser();

    await createMeal(cookie);

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookie)
      .expect(200);

    const mealId = mealsResponse.body.meals[0].id;

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set("Cookie", cookie)
      .send({
        name: "Test Meal Edit",
        description: "Testing the meals routes",
        date: "2024-01-05 14:07:20",
        onDiet: true,
      })
      .expect(204);
  });

  it("should be able to delete a meal", async () => {
    await createUser();
    const cookie = await loginUser();

    await createMeal(cookie);

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookie)
      .expect(200);

    const mealId = mealsResponse.body.meals[0].id;

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set("Cookie", cookie)
      .expect(204);
  });

  it("should be able to list all meals", async () => {
    await createUser();
    const cookie = await loginUser();

    await createMeal(cookie);
    await createMeal(cookie);

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookie)
      .expect(200);

    expect(mealsResponse.body.meals).toHaveLength(2);
  });

  it("should be able to show only one meal", async () => {
    await createUser();
    const cookie = await loginUser();

    await createMeal(cookie);

    const mealsResponse = await request(app.server)
      .get("/meals")
      .set("Cookie", cookie)
      .expect(200);

    const mealId = mealsResponse.body.meals[0].id;

    const mealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(mealResponse.body).toEqual({
      meals: expect.objectContaining({
        name: "Test Meal",
        description: "Testing the meals routes",
        date: "2024-01-05 14:07:20",
        on_diet: 1,
      }),
    });
  });

  it("should be able to retrieve user metrics", async () => {
    await createUser();
    const cookie = await loginUser();

    await createMeal(cookie, breakFastData);
    await createMeal(cookie, lunchData);
    await createMeal(cookie, snackData);
    await createMeal(cookie, dinnerData);

    const metricsResponse = await request(app.server)
      .get("/meals/metrics")
      .set("Cookie", cookie)
      .expect(200);

    expect(metricsResponse.body).toEqual({
      totalMeals: 4,
      totalMealsOnDiet: 3,
      totalMealsOffDiet: 1,
      bestOnDietSequence: 2,
    });
  });

  async function createUser() {
    await request(app.server)
      .post("/users/create")
      .send({
        username: "test_user",
        password: "password12345",
        email: "test_user@gmail.com",
        name: "Test User",
      })
      .expect(201);
  }

  async function loginUser() {
    const userResponse = await request(app.server)
      .post("/users/login")
      .send({
        username: "test_user",
        password: "password12345",
      })
      .expect(201);

    return userResponse.get("Set-Cookie");
  }

  async function createMeal(cookie: string[], mealData?: object) {
    await request(app.server)
      .post("/meals/create")
      .set("Cookie", cookie)
      .send(
        mealData || {
          name: "Test Meal",
          description: "Testing the meals routes",
          date: "2024-01-05 14:07:20",
          onDiet: true,
        },
      )
      .expect(201);
  }

  const breakFastData = {
    name: "Breakfast",
    description: "It's a breakfast",
    onDiet: true,
    date: "2021-01-01 08:00:00",
  };

  const lunchData = {
    name: "Lunch",
    description: "It's a lunch",
    onDiet: false,
    date: "2021-01-01 12:00:00",
  };

  const dinnerData = {
    name: "Dinner",
    description: "It's a dinner",
    onDiet: true,
    date: "2021-01-01 20:00:00",
  };

  const snackData = {
    name: "Snack",
    description: "It's a snack",
    onDiet: true,
    date: "2021-01-01 15:00:00",
  };
});
