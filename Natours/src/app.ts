import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { routes } from './controllers/routes';
import { envConfig } from './env';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

/***
 * Middleware
 * Basically a function that can modify the incoming request data
 * It's just a step that the request goes through while it's being processed
 *  */

app.use((request: Request, response: Response, next: NextFunction) => {
  console.log('Hello from the middleware');
  // If the next didn't call here then the request/response cycle would stuck and never send back a response to the client
  next();
});

app.use((request: Request & { requestTime?: string }, response: Response, next: NextFunction) => {
  request.requestTime = new Date().toISOString();
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
