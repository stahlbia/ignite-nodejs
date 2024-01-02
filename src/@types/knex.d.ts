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
      pictureURL?: string;
      created_at: string;
    };
    meals: {
      id: string;
      user_id: string;
      name: string;
      description?: string;
      date_time?: string;
      on_diet: boolean;
      registered_at: string;
    };
  }
}
