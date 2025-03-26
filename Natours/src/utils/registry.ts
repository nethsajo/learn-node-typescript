import { envConfig } from '@/env';
import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { version } from '../../package.json';
import { type OpenAPIDefinitions } from '@asteasolutions/zod-to-openapi/dist/openapi-registry';

export const registry = new OpenAPIRegistry();

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
