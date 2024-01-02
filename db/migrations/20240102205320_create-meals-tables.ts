import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.uuid("id").notNullable().primary();
    table.text("user_id").notNullable();
    table.text("name").notNullable();
    table.text("description");
    table.timestamp("date_time").notNullable().defaultTo(knex.fn.now());
    table.boolean("on_diet").notNullable();
    table.timestamp("registered_at").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
}
