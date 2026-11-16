# PROJECT KNOWLEDGE BASE

**Updated:** 2026-11-16
**Scope:** NestJS boilerplate; paths below are relative to this directory.

## OVERVIEW

This is a reusable **boilerplate repository**, not a production application's domain specification. It provides a NestJS 11 backend with PostgreSQL, TypeORM, Redis, Bull, RabbitMQ, Slack notifications, and sample HTTP/job code. Two runtime modes matter: the HTTP app in `src/main.ts` and the CLI/job runtime in `src/execute-script*.ts`.

**Agents working on projects built from this boilerplate must modify this file to reflect the actual project.** During adoption, replace this overview with the project's purpose, update the structure, code map, commands, configuration, and deployment notes, and remove obsolete sample/template guidance. Keep verified infrastructure conventions that still apply. Update this file as the project evolves; do not leave boilerplate assumptions presented as application facts.

## STRUCTURE

```text
./
├── src/                 # HTTP app, jobs, shared infrastructure, entities, migrations
├── test/                # HTTP integration specs, setup, mocks, utilities
├── docs/                # configuration adoption and verification notes
├── .github/workflows/   # CI and PR automation templates
├── Dockerfile           # multi-stage production image
├── entrypoint.sh        # production migration-before-start wrapper
├── connection.ts        # shared test database connection
├── create-db.ts         # development/test database creation
├── drop-db.ts           # development/test database removal
└── package.json         # canonical commands and toolchain requirements
```

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| App bootstrap | `src/main.ts`, `src/app.module.ts` | HTTP runtime, URI versioning, global validation |
| CLI/jobs | `src/execute-script.ts`, `src/execute-script-nostop.ts`, `src/job.module.ts`, `src/scripts/` | `nest-commander` commands and optional MQ consumers |
| API features | `src/v1/` | Sample feature is a starting point for application modules |
| Shared infrastructure | `src/commons/` | Cache, utilities, middleware, interceptors, pipes, queue processors |
| Configuration | `src/config/`, `.env.example` | Namespaced config factories and infrastructure configuration |
| Messaging | `src/rabbitmq/` | Separate producer and consumer module wiring |
| Persistence | `src/entities/`, `src/migrations/`, `src/config/typeorm.config.ts` | Entities and CLI migration configuration |
| Test support | `test/`, `connection.ts`, `test-config.cjs`, `jest.config.mjs` | Worker isolation, mocks, shared setup |
| Adoption guidance | `README.md`, `docs/configuration-refresh.md` | Local setup, operational details, configuration decisions |

## CODE MAP

| Symbol | Type | Location | Role |
| --- | --- | --- | --- |
| `bootstrap` | function | `src/main.ts` | Starts the HTTP app on port 3000 |
| `AppModule` | module | `src/app.module.ts` | HTTP features and RabbitMQ producer |
| `JobModule` | module | `src/job.module.ts` | CLI runtime; optionally loads MQ consumers |
| `SCRIPTS` | const | `src/scripts/index.ts` | Registry of `nest-commander` commands |
| `SampleJob` | command | `src/scripts/jobs/sample.job.ts` | Example `job:sample` command |
| `SampleModule` | module | `src/v1/sample/sample.module.ts` | Example API feature |
| `EventMqProducerModule` | module | `src/rabbitmq/eventmq-producer.module.ts` | Producer-only messaging infrastructure |
| `EventMqAppModule` | module | `src/rabbitmq/eventmq-app.module.ts` | Consumer runtime |
| `AppController` | controller | `src/app.controller.ts` | Root endpoint and PostgreSQL/Redis/RabbitMQ `/healthz` readiness check |

## CONVENTIONS

- Run project commands from this directory. Use Yarn 4.14.1 via Corepack with the `node-modules` linker; do not use npm for project dependency management.
- Node >=26.13.1 <27 is required; `.node-version`, Docker, and CI pin 26.13.1. Install Corepack 0.36.0 explicitly before preparing Yarn; Node 26 does not bundle it.
- TypeScript uses ESM/NodeNext. Preserve `.js` suffixes on local imports in TypeScript files. Configured path aliases include `@/src/*`, `@/test/*`, and `src/*`.
- App and job runtimes are separate. Check both `AppModule` and `JobModule` when changing shared infrastructure or providers.
- Add application features under `src/v1/`; reuse existing shared infrastructure in `src/commons/` before adding helpers.
- Request DTOs need class-validator metadata. Global validation transforms input, strips unknown properties, and rejects DTOs without validation metadata through `forbidUnknownValues`.
- Keep `.env.example` and setup documentation aligned with configuration changes. Replace example secrets and service identifiers when adopting the template.
- Tests include colocated `*.spec.ts` and `test/*.e2e-spec.ts`; `yarn test` runs both through the main Jest configuration.
- `yarn lint` and `yarn format` modify files; inspect the diff afterward. ESLint configuration lives in `eslint.config.mjs`.
- After copying the starter into its own Git repository, run `yarn prepare` to install Husky hooks; Yarn 4 does not run it automatically. Pre-commit checks staged TypeScript files.
- Agents must not commit or push changes; leave Git commits and pushes to the user. Do not add AI co-author trailers to commit messages.

## ANTI-PATTERNS (THIS BOILERPLATE)

- Do not treat sample entities, endpoints, jobs, RabbitMQ names, or CI/deployment placeholders as the consuming project's requirements.
- Do not add a `nest-commander` command without registering it in `src/scripts/index.ts`.
- Do not use `tsx` for decorator-heavy Nest/TypeORM execution. Use the existing `ts-node/esm` commands; database create/drop scripts are limited exceptions.
- Do not rely on automatic production schema synchronization. The starter has a sample entity but no initial schema migration; generate and review migrations for the application.
- Do not assume TypeORM CLI always reads source files when `dist/` exists. Set `NODE_ENV=local` for source entities/migrations; production commands use compiled files.
- Do not assume container startup only launches the app: `entrypoint.sh` runs compiled migrations first and stops on failure.
- Do not treat `/healthz` as a liveness probe or proof of message delivery. It checks PostgreSQL, Redis `PING`, and RabbitMQ connection state; non-blocking RabbitMQ startup can initially report down. It returns HTTP 200/503 with boolean top-level `status` and Terminus per-dependency results.
- Do not assume CI validates lint, coverage, or the Docker image; its current checks are build and tests.

## UNIQUE STYLES

- Shared infrastructure is centralized in `src/commons/`; Bull processors live in `src/commons/queue-processors/`.
- The HTTP app is RabbitMQ producer-only. Job mode adds consumers only when `RABBITMQ_MODE=true`; both job modes retain PostgreSQL/Redis infrastructure.
- `NODE_ENV=local` controls source-file selection for TypeORM CLI, while `ENV_NAME` independently controls SQL logging and RabbitMQ queue environment naming.
- Tests isolate PostgreSQL databases, Redis keys, and Bull namespaces per worker. RabbitMQ is mocked; outbound HTTP is blocked except localhost.
- Place runtime assets under `src/assets/`; Nest copies them to `dist/src/assets/`.

## COMMANDS

```bash
# Toolchain bootstrap (npm is used only to install Corepack globally)
npm install --global corepack@0.36.0
corepack enable
corepack prepare yarn@4.14.1 --activate

# Copy .env.example to .env and configure local services first
yarn install --immutable
yarn prepare
yarn db:create
yarn db:migrate:up
yarn start:dev

# Build, checks, migrations, and jobs
yarn build
yarn start:prod
yarn lint
yarn format
yarn db:create:test
yarn test
yarn test --runInBand
yarn db:migrate:generate ./src/migrations/AddNewColumnToTables
yarn db:migrate:create ./src/migrations/InitialSchema
yarn db:migrate:down
RABBITMQ_MODE=false yarn execute:dev job:sample --name Developer
```

`yarn test` is the single supported test entrypoint, including HTTP integration specs. PostgreSQL and Redis must be available. `TEST_MAX_WORKERS` defaults to 3 and must be a positive integer; use the same value for test database creation and execution. Worker databases are named `${DB_NAME_TEST}_1` through `${DB_NAME_TEST}_${TEST_MAX_WORKERS}`; the test base name must differ from development/production database names.

## NOTES

- GitHub Actions targets `release`, `develop`, and `prod`, provisions PostgreSQL and Redis, installs immutable dependencies, builds, creates worker test databases, and runs `yarn test`. Adapt branch targets and service configuration for the consuming project.
- Docker pins Node 26.13.1 and Corepack 0.36.0, installs runtime dependencies in the production stage, and runs as the `node` user. The entrypoint invokes `yarn db:migrate:up:prod` before `node dist/src/main.js`. The image exposes 3000 and 3001; the HTTP bootstrap listens on 3000.
- Jest uses ESM flags and SWC, setup from `test/setup/`, and up to three workers by default, capped by available CPUs.
- Production schema synchronization is disabled. Test synchronization is scoped to worker-specific test databases.
- Deployment registry, Kubernetes configuration, Jenkins credentials, real notification endpoints, and application-specific integrations belong to the consuming project; update this document alongside their implementation.
