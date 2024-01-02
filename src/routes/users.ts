import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/create", async (request, reply) => {
    const createUserBodySchema = z.object({
      username: z.string(),
      password: z.string(),
      email: z.string(),
      name: z.string(),
      pictureURL: z.string(),
    });

    const { username, password, email, name, pictureURL } =
      createUserBodySchema.parse(request.body);

    await knex("users").insert({
      id: randomUUID(),
      username,
      password,
      email,
      name,
      pictureURL,
    });

    return reply.status(201).send();
  });

  app.post("/login", async (request, reply) => {
    const createUserBodySchema = z.object({
      username: z.string(),
      password: z.string(),
    });

    const { username, password } = createUserBodySchema.parse(request.body);

    try {
      const user = await knex("users").where({ username }).first();

      if (!user || user?.password !== password) {
        return reply
          .status(401)
          .send({ message: "Invalid username or password" });
      }

      return reply.status(201).send({ message: "Login successful" });
    } catch (error) {
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
