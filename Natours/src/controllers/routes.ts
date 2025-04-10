import locationsRoutes from './locations/routes';
import toursRoutes from './tours/routes';
import usersRoutes from './users/routes';

export const routes = [usersRoutes, locationsRoutes, toursRoutes] as const;

export type AppRoutes = (typeof routes)[number];
