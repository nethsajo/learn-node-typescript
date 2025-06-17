import authRoutes from './auth/routes';
import locationsRoutes from './locations/routes';
import meRoutes from './me/routes';
import serverRoutes from './server/routes';
import usersRoutes from './users/routes';

export const routes = [serverRoutes, authRoutes, usersRoutes, meRoutes, locationsRoutes] as const;

export type AppRoutes = (typeof routes)[number];
