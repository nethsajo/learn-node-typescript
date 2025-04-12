import express, { type Router } from 'express';

import { archiveUserRouteHandler } from './archive-user';
import { createUserRouteHandler } from './create-user';
import { deleteUserRouteHandler } from './delete-user';
import { getUserRouteHandler } from './get-user';
import { getUsersRouteHandler } from './get-users';
import { unarchiveUserRouteHandler } from './unarchive-user';
import { updateUserRouteHandler } from './update-user';

const usersRoutes: Router = express.Router();

usersRoutes.get('/users', getUsersRouteHandler);
usersRoutes.post('/users', createUserRouteHandler);

usersRoutes.get('/users/:id', getUserRouteHandler);
usersRoutes.put('/users/:id', updateUserRouteHandler);
usersRoutes.put('/users/:id/archive', archiveUserRouteHandler);
usersRoutes.put('/users/:id/unarchive', unarchiveUserRouteHandler);
usersRoutes.delete('/users/:id', deleteUserRouteHandler);

export default usersRoutes;
