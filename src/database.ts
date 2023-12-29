import createKnex, { Knex } from "knex";
import { env } from "./env";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL env not found.");
}

export const knexConfig: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./.tmp/migrations",
  },
};

export const knex = createKnex(knexConfig);
