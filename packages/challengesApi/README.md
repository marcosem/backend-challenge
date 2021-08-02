# Challenges API

A application designed to support GraphQL requests and Kafka microservices communications.

## Setup

- Clone this Repository
- On backend-challange root execute the docker compose to create the containers.
  - The user was changed from "docker" to "postgres" due lack of permission to run the migrations.
```
docker-compose up -d
```
- Download the packages
```
yarn
```
- Run the migrations
```
yarn typeorm migration:run
```
- Run the Challenges API application
```
yarn dev:server
```
- All GraphQL queries may be found in the following route:
```
http://localhost:3333/graphql
```
- All queries may be reproduced by importing the Insomnia exported file:
[Insomnia_queries.json](./Insomnia_queries.json)

- For application Testing execute the following command:
```
yarn test
```
