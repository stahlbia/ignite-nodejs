import { Database } from "./database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET", // pass the list of tasks
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;
      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST", // create a new task
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      if (!title) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "title is required" }));
      }
      if (!description) {
        return res
          .writeHead(400)
          .end(JSON.stringify({ message: "description is required" }));
      }

      const currentDate = new Date().toLocaleDateString();
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: currentDate,
        updated_at: currentDate,
      };
      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT", // edit something on the task
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      const currentDate = new Date().toLocaleDateString();
      if (!title || !description) {
        return res
          .writeHead(400)
          .end(
            JSON.stringify({ message: "title or description are required" })
          );
      }
      const [task] = database.select("tasks", { id });
      if (!task) {
        return res.writeHead(404).end();
      }
      database.update("tasks", id, {
        title: title,
        description: description,
        updated_at: currentDate,
      });
      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH", // mark the task as completed
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const [task] = database.select("tasks", { id });
      if (!task) {
        return res.writeHead(404).end();
      }
      const isTaskCompleted = !!task.completed_at;
      const completed_at = isTaskCompleted
        ? null
        : new Date().toLocaleDateString();
      database.update("tasks", id, {
        completed_at,
      });
      return res.writeHead(204).end();
    },
  },
  {
    method: "DELETE", // delete the task
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const [task] = database.select("tasks", { id });
      if (!task) {
        return res.writeHead(404).end();
      }
      database.delete("tasks", id);
      return res.writeHead(204).end();
    },
  },
];
