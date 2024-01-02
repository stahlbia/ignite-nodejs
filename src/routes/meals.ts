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
        dateTime: z.string().optional(),
        onDiet: z.boolean(),
      });

      const { name, description, dateTime, onDiet } =
        createMealBodySchema.parse(request.body);

      const userId = request.cookies.userId;

      await knex("meals").insert({
        id: randomUUID(),
        user_id: userId,
        name,
        description,
        date_time: dateTime || knex.fn.now(),
        on_diet: onDiet,
      });

      return reply.status(201).send();
    },
  );
}
