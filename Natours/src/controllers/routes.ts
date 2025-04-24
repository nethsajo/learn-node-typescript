import locationsRoutes from './locations/routes';
import serverRoutes from './server/routes';
import usersRoutes from './users/routes';

export const routes = [serverRoutes, usersRoutes, locationsRoutes] as const;

export type AppRoutes = (typeof routes)[number];
