import express, { type NextFunction, type Request, type Response } from 'express';
import morgan from 'morgan';
import { routes } from './controllers/routes';
import { createDbClient } from './db/create-db-client';
import { envConfig } from './env';

const dbClient = createDbClient();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use((request: Request, response: Response, next: NextFunction) => {
  response.locals.dbClient = dbClient;
  next();
});

/* Routes */
routes.forEach(route => {
  app.use('/api/v1', route);
});

/* Server */
app.listen(envConfig.APP_PORT, () => {
  console.log('Listening on port', envConfig.APP_PORT);
});
