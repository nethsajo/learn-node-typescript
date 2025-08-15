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
import { STAGES } from './constants/env';
import { isNotProduction } from './middlewares/stage-guard';

const app = express();

app.get('/openapi.json', isNotProduction, (request, response) => {
  const doc = generateOpenAPISpec(registry.definitions);
  response.json(doc);
});

app.use('/swagger', isNotProduction, swaggerUi.serve);
app.get(
  '/swagger',
  isNotProduction,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/openapi.json',
    },
    customCss: '.topbar { display: none; }',
  })
);

app.use('/reference', isNotProduction, apiReference({ url: '/openapi.json' }));

/* Register Schemas */
Object.entries(schemas).forEach(([key, value]) => {
  registry.register(key, value);
});

/* Middlewares */
app.use((req, res, next) => {
  const ALLOWED_ORIGINS = ['https://yourdomain.com', 'https://www.yourdomain.com'];

  if (process.env.STAGE !== STAGES.Prod) {
    ALLOWED_ORIGINS.push('http://localhost:3001');
    ALLOWED_ORIGINS.push('http://localhost:5173');
  }

  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })(req, res, next);
});

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

export default app;
