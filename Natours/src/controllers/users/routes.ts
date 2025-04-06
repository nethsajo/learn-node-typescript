import express, { type Router } from 'express';

import { archiveUserRouteHandler } from './archive-user';
import { createUserRouteHandler } from './create-user';
import { getUserRouteHandler } from './get-user';
import { getUsersRouteHandler } from './get-users';
import { updateUserRouteHandler } from './update-user';

const usersRoutes: Router = express.Router();

usersRoutes.get('/users', getUsersRouteHandler);
usersRoutes.post('/users', createUserRouteHandler);

usersRoutes.get('/users/:id', getUserRouteHandler);
usersRoutes.put('/users/:id', updateUserRouteHandler);
usersRoutes.delete('/users/:id/archive', archiveUserRouteHandler);

export default usersRoutes;
