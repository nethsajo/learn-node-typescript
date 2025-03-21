import express from 'express';
import morgan from 'morgan';
import { routes } from './controllers/routes';
import { envConfig } from './env';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

/* Routes */
routes.forEach(route => {
  app.use('/api/v1', route);
});

/* Server */
app.listen(envConfig.APP_PORT, () => {
  console.log('Listening on port', envConfig.APP_PORT);
});
