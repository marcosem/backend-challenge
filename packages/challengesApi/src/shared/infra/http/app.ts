import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import 'express-async-errors';
import '@shared/infra/typeorm';
import '@shared/container';
import AppError from '@shared/errors/AppError';
import routes from './routes';
import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
import KafkaConsumer from './middlewares/kafkaConsumer';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
  }),
);

// Need to wait application start before start listening kafka, due the syringed dependances
const kafkaConsumer = new KafkaConsumer();
setTimeout(() => {
  kafkaConsumer.startConsumer();
}, 2000);

// app.use(errors());
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

export default app;
