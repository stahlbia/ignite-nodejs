import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.uuid("id").notNullable().primary();
    table.text("user_id").references("users.is").notNullable();
    table.text("name").notNullable();
    table.text("description").notNullable();
    table.boolean("on_diet").notNullable();
    table.timestamp("date").notNullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
}
