import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";
import { checkLoginSessionExists } from "../middlewares/check-login-session-exists";

export async function mealsRoutes(app: FastifyInstance) {
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
}
