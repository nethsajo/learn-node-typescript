import 'express-async-errors';

import { apiReference } from '@scalar/express-api-reference';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { routes } from '@/controllers/routes';
import { schemas } from '@/data/schemas';
import { errorHandlerMiddleware } from '@/middlewares/error-handler';
import { generateOpenAPISpec, registry } from '@/utils/registry';

import { envConfig } from './env';
import { logger } from './utils/logger';

const app = express();

/* Register Schemas */
Object.entries(schemas).forEach(([key, value]) => {
  registry.register(key, value);
});

app.get('/openapi.json', (req, res) => {
  res.json(generateOpenAPISpec(registry.definitions));
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

/* Routes */
routes.forEach(route => {
  app.use('/api/v1', route);
});

/* Error handling middleware */
app.use(errorHandlerMiddleware);

/* Server */
app.listen(envConfig.APP_PORT, () => {
  logger.info('Listening on port', envConfig.APP_PORT);
});
