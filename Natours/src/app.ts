import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { version } from '../package.json';
import { routes } from './controllers/routes';
import { schemas } from './data/schemas';
import { envConfig } from './env';
import { errorHandlerMiddleware } from './middlewares/error-handler';
import { registry } from './utils/registry';

const app = express();

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
    })
  )
);

/* Register Schemas */
Object.entries(schemas).forEach(([key, value]) => {
  registry.register(key, value);
});

app.use(errorHandlerMiddleware);
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
