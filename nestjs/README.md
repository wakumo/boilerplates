
### Setup

1. Create .env file

```
cp .env.example .env
```

Edit .env file

2. Install

```
yarn install
```

3. Create database

```
yarn ts-node-esm create-db.ts
```

4. Run migration

```
yarn db:migrate:up
```

5. Run server

```
yarn migrate_and_start
```

More cmds:
```
yarn db:migrate:generate ./src/migrations/AddNewColumnToTables
yarn ts-node-esm drop-db.ts
yarn test
```
