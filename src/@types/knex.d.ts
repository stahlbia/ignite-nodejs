// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      username: string;
      password: string;
      email: string;
      name: string;
      created_at: string;
      updated_at: string;
    };
    meals: {
      id: string;
      user_id: string;
      name: string;
      description?: string;
      on_diet: boolean;
      date?: string;
      created_at: string;
      updated_at: string;
    };
  }
}
