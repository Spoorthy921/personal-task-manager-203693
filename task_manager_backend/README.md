# Task Manager Backend (Express + MongoDB)

## Endpoints
- `GET /healthz` - health check
- `POST /auth/register` - register `{ email, password }` -> `{ user, token }`
- `POST /auth/login` - login `{ email, password }` -> `{ user, token }`
- `GET /tasks` - list tasks (Bearer token)
- `POST /tasks` - create task (Bearer token)
- `PUT /tasks/:id` - update task (Bearer token)
- `PATCH /tasks/:id/toggle` - toggle complete (Bearer token)
- `DELETE /tasks/:id` - delete (Bearer token)

## Swagger
- `GET /docs` - Swagger UI

## Environment variables
See `.env.example`. Ensure `JWT_SECRET` is set in `.env` for auth to work.

