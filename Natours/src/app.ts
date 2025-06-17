import 'express-async-errors';

import { apiReference } from '@scalar/express-api-reference';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { routes } from '@/controllers/routes';
import { schemas } from '@/data/schemas';
import { generateOpenAPISpec, registry } from '@/lib/openapi';
import { errorHandlerMiddleware } from '@/middlewares/error-handler';

import { envConfig } from './env';
import { setupDbClientMiddleware } from './middlewares/setup-db-client';
import { logger } from './utils/logger';

const app = express();

/* Register Schemas */
Object.entries(schemas).forEach(([key, value]) => {
  registry.register(key, value);
});

app.get('/openapi.json', (request, response) => {
  response.json(generateOpenAPISpec(registry.definitions));
});

app.use(
  '/swagger',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/openapi.json', // Load OpenAPI spec dynamically
    },
    customCss: '.topbar { display: none; }',
  })
);

app.use('/reference', apiReference({ url: '/openapi.json' }));

/* Middlewares */
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setupDbClientMiddleware);
app.use(cookieParser(envConfig.COOKIE_SECRET));

/* Routes */
routes.forEach(route => {
  app.use('/', route);
});

/* Error handling middleware */
app.use(errorHandlerMiddleware);

/* Server */
app.listen(envConfig.APP_PORT, () => {
  logger.info('Listening on port', envConfig.APP_PORT);
});
