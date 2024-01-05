import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").notNullable().primary();
    table.text("username").notNullable().unique();
    table.text("password").notNullable();
    table.text("email").notNullable().unique();
    table.text("name").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}
