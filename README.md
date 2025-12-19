# Web-application

Full-stack project made using React, Vite, TypeScript, TailwindCSS, tRPC, Kysely, PostgreSQL. The goal of the project is to have user authentication and CRUD operations for user-specific posts/tasks.

    .vscode/ folders have editor settings configured, to ensure that hypothetical developer team has consistent tools.

    .env file is commented off from .gitignore to make it easier to test the project from GitHub, understanding the dangers of this kind of behaviour generally, but it's not relevant for this scenario.

## backend/
```
src/  
├── db/
│   ├── index.ts      # Defines the database using Kysely database, and interface from types.ts.
│   └── types.ts      # Creates an interface for database and models the tables using Kysely.
├── trpc/
│   ├── index.ts      # Initializes trpc-context with type Context from context.ts.
│   ├── context.ts    # Creates Express context using database from db.ts.
│   └── routers/
│       ├── index.ts  # Calls and combines routers.
│       ├── users.ts  # Defines userRouter with CRUD operations.
│       └── 
├── server.ts         # Defines express app, uses trpc-router for app and listens to port.
```