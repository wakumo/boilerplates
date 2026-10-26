# NestJS starter

## Prerequisites

- Node **22.23.4** (see `.node-version`) and Corepack/Yarn **4.14.1**.
- PostgreSQL, Redis, and RabbitMQ. CI uses PostgreSQL 13.14; choose a supported PostgreSQL release for a new deployment.

```sh
corepack enable
corepack prepare yarn@4.14.1 --activate
cp .env.example .env
yarn install --immutable
yarn prepare
yarn db:create
yarn db:migrate:up
yarn start:dev
```

Edit `.env` for your local services before creating databases. `NODE_ENV=local` makes TypeORM CLI read source entities/migrations even if `dist/` exists. `ENV_NAME=development` independently controls SQL logging and RabbitMQ queue environment naming. The sample Slack URL allows startup but is not a working notification endpoint; supply your own before sending messages. Replace the example JWT secret.

After copying this starter into its own Git repository, run `yarn prepare` to install Husky hooks. Yarn 4 does not run `prepare` automatically. Pre-commit runs ESLint and Prettier only on staged TypeScript files. Use `HUSKY=0 yarn prepare` to skip hook installation.

## Tests

All tests, including HTTP integration specs, use **one command**:

```sh
yarn db:create:test
yarn test
```

PostgreSQL and Redis must be available. RabbitMQ is mocked and outbound HTTP is blocked except localhost. `TEST_MAX_WORKERS` defaults to 3 and must be a positive integer. Set it before both database creation and test execution: databases are `${DB_NAME_TEST}_1` through `${DB_NAME_TEST}_${TEST_MAX_WORKERS}`. Redis and Bull use separate per-worker namespaces. The configured test base name must differ from your development/production database names. `yarn test --runInBand` uses worker 1; `yarn test path/to/file.spec.ts` selects a suite.

```sh
yarn db:drop:test # drops only the configured worker test databases
yarn db:drop      # drops only DB_NAME
```

## Build, migrations and jobs

```sh
yarn build
yarn db:migrate:generate ./src/migrations/AddNewColumnToTables
yarn db:migrate:create ./src/migrations/InitialSchema
yarn db:migrate:up
yarn db:migrate:down
yarn execute:dev job:sample --name Developer
yarn execute job:sample --name Developer
yarn exec eslint src test create-db.ts drop-db.ts pg-client.ts
```

The starter contains a sample entity but no initial schema migration: generate/review one for your application before using entity-backed endpoints. Production never enables schema synchronization. Tests synchronize only their worker-specific databases.

The HTTP app is RabbitMQ producer-only. Set `RABBITMQ_MODE=true` for job consumer mode. RabbitMQ startup remains non-blocking (`wait: false`); readiness currently checks PostgreSQL only. Both job modes retain DB/Redis infrastructure. Failed commands return a nonzero status.

Place runtime assets under `src/assets/`; Nest copies them to `dist/src/assets/`. TypeScript uses NodeNext ESM: keep `.js` suffixes on local imports. ESLint uses only `eslint.config.mjs`; generated migrations are excluded from formatting.

## Container and CI

```sh
docker build --pull -t nestjs-starter .
docker run --env-file .env -p 3000:3000 nestjs-starter
```

Supply container-reachable service hosts and set `NODE_ENV=production` when deploying. Both image stages pin Node 22.23.4; production installs runtime dependencies only. Startup runs compiled migrations and stops if they fail. `.dockerignore` excludes local secrets, dependencies and generated output.

CI installs immutable dependencies, builds, prepares worker databases, and runs `yarn test`. PR-Agent uses the shared proxy variables; `SHARED_AI_PROXY_MODEL_FALLBACKS` must contain the fallback list in the format expected by PR-Agent. Deployment registry, Kubernetes configuration and Jenkins credentials belong to the consuming project.

See [configuration comparison](docs/configuration-refresh.md) for adoption decisions and verification notes.
