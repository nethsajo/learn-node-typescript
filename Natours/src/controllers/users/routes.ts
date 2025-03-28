import express, { type Router } from 'express';
import { createUserRouteHandler } from './create-user';
import { getUsersRouteHandler } from './get-users';
import { getUserRouteHandler } from './get-user';
import { updateUserRouteHandler } from './update-user';
import { archiveUserRouteHandler } from './archive-user';

const usersRoutes: Router = express.Router();

usersRoutes.get('/users', getUsersRouteHandler);
usersRoutes.post('/users', createUserRouteHandler);

usersRoutes.get('/users/:id', getUserRouteHandler);
usersRoutes.put('/users/:id', updateUserRouteHandler);
usersRoutes.delete('/users/:id/archive', archiveUserRouteHandler);

export default usersRoutes;
