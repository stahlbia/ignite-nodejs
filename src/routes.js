import { Database } from "./database.js"
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
    {
        method: 'GET', // pass the list of tasks
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query
            const users = database.select('tasks', search ? {
                title: search,
                description: search,
                completed_at: search,
                created_at: search,
                updated_at: search,
            } : null)
            return res.end(JSON.stringify(users))
        }
    },
    {
        method: 'POST', // create a new task
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date().getDate(),
                updated_at: created_at,
            }
            database.insert('tasks', task)

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT', // edit something on the task
        path: buildRoutePath('/tasks:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body
            database.update('tasks', id, {
                title,
                description,
                completed_at,
                created_at,
                updated_at: new Date().getDate(),
            })
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH', // mark the task as completed
        path: buildRoutePath('/tasks:id'),
        handler: (req, res) => {
            const { id } = req.params
            database.update('tasks', id, {
                completed_at: new Date().getDate(),
                updated_at: completed_at,
            })
            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE', // delete the task
        path: buildRoutePath('/tasks:id'),
        handler: (req, res) => {
            const { id } = req.params
            database.delete('tasks', id)
            return res.writeHead(204).end()
        }
    },
]