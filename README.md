## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database Migrations

```bash
# Generate a new migration (auto-detect entity changes)
$ npm run migration:generate --name=Init

# Create an empty migration file (for custom SQL)
$ npm run migration:create --name=CreateUsersTable

# Run all pending migrations
$ npm run migration:run

# Revert the last migration
$ npm run migration:revert

# Show all migrations and their execution status (executed vs pending)
$ npm run migration:show
```

```bash
# Local environment
$ npm run seed

# Inside Docker container
$ node dist/db/scripts/seed.js
```
