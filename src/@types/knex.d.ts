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
  }
}
