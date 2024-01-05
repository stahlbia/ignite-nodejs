import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { checkLoginSessionExists } from "../middlewares/check-login-session-exists";

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    "/",
    { preHandler: [checkLoginSessionExists] },
    async (request, reply) => {
      const userId = request.cookies.userId;
      const meals = await knex("meals")
        .where({ user_id: userId })
        .orderBy("date", "desc");

      return reply.send({ meals });
    },
  );

  app.get(
    "/:mealId",
    { preHandler: [checkLoginSessionExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() });

      const { mealId } = paramsSchema.parse(request.params);
      const userId = request.cookies.userId;

      const meals = await knex("meals")
        .where({ user_id: userId, id: mealId })
        .first();

      return reply.send({ meals });
    },
  );

  app.get(
    "/metrics",
    { preHandler: [checkLoginSessionExists] },
    async (request, reply) => {
      const userId = request.cookies.userId;
      const totalMealsOnDiet = await knex("meals")
        .where({ user_id: userId, on_diet: true })
        .count("id", { as: "total" })
        .first();

      const totalMealsOffDiet = await knex("meals")
        .where({ user_id: userId, on_diet: false })
        .count("id", { as: "total" })
        .first();

      const totalMeals = await knex("meals")
        .where({ user_id: userId })
        .orderBy("date", "desc");

      const { bestOnDietSequence } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.on_diet) {
            acc.currentSequence += 1;
          } else {
            acc.currentSequence = 0;
          }

          if (acc.currentSequence > acc.bestOnDietSequence) {
            acc.bestOnDietSequence = acc.currentSequence;
          }

          return acc;
        },
        { bestOnDietSequence: 0, currentSequence: 0 },
      );

      return reply.send({
        totalMeals: totalMeals.length,
        totalMealsOnDiet: totalMealsOnDiet?.total,
        totalMealsOffDiet: totalMealsOffDiet?.total,
        bestOnDietSequence,
      });
    },
  );

  app.post(
    "/create",
    { preHandler: [checkLoginSessionExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        onDiet: z.boolean(),
        date: z.string().optional(),
      });

      const { name, description, date, onDiet } = createMealBodySchema.parse(
        request.body,
      );

      const userId = request.cookies.userId;

      await knex("meals").insert({
        id: randomUUID(),
        user_id: userId,
        name,
        description,
        on_diet: onDiet,
        date: date || knex.fn.now(),
      });

      return reply.status(201).send();
    },
  );

  app.put(
    "/:mealId",
    { preHandler: checkLoginSessionExists },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() });

      const { mealId } = paramsSchema.parse(request.params);

      const updateMealBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        onDiet: z.boolean().optional(),
        date: z.string().optional(),
      });

      const { name, description, onDiet, date } = updateMealBodySchema.parse(
        request.body,
      );

      const meal = await knex("meals").where({ id: mealId }).first();

      if (!meal) {
        return reply.status(404).send({ error: "Meal not found" });
      }

      await knex("meals").where({ id: mealId }).update({
        name,
        description,
        date,
        on_diet: onDiet,
      });

      return reply.status(204).send();
    },
  );

  app.delete(
    "/:mealId",
    { preHandler: checkLoginSessionExists },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() });

      const { mealId } = paramsSchema.parse(request.params);

      const meal = await knex("meals").where({ id: mealId }).first();

      if (!meal) {
        return reply.status(404).send({ error: "Meal not found" });
      }

      await knex("meals").where({ id: mealId }).delete();

      return reply.status(204).send();
    },
  );
}
