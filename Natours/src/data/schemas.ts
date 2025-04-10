import { locationSchemaOpenApi } from './locations/schema';
import { userSchemaOpenApi } from './users/schema';

export const schemas = {
  User: userSchemaOpenApi,
  Location: locationSchemaOpenApi,
};
