import toursRoutes from './tours/routes';
import usersRoutes from './users/routes';

export const routes = [usersRoutes, toursRoutes] as const;

export type AppRoutes = (typeof routes)[number];
