import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { OpenAPIDefinitions } from '@asteasolutions/zod-to-openapi/dist/openapi-registry';

import { envConfig } from '@/env';

import { version } from '../../package.json';

export const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export const generateOpenAPISpec = (definitions: OpenAPIDefinitions[]) => {
  const generator = new OpenApiGeneratorV3(definitions);
  return generator.generateDocument({
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
  });
};
