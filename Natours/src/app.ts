import { routes } from '@/controllers/routes';
import { schemas } from '@/data/schemas';
import { errorHandlerMiddleware } from '@/middlewares/error-handler';
import { registry } from '@/utils/registry';
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { version } from '../package.json';
import { envConfig } from './env';

const app = express();

/* Register Schemas */
Object.entries(schemas).forEach(([key, value]) => {
  registry.register(key, value);
});

app.use(
  '/swagger',
  swaggerUi.serve,
  swaggerUi.setup(
    new OpenApiGeneratorV3(registry.definitions).generateDocument({
      openapi: '3.0.0',
      info: {
        version,
        title: `${envConfig.STAGE.toUpperCase()} API`,
        description: 'API Documentation',
      },
      externalDocs: {
        description: 'API Reference',
        url: '/reference',
      },
    }),
    { customCss: '.topbar { display: none; }' }
  )
);

/* Middleware */
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
  console.log('Listening on port', envConfig.APP_PORT);
});
