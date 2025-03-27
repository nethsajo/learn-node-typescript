import express, { type Router } from 'express';
import { archiveUser, updateUser } from './controller';
import { createUserRouteHandler } from './create-user';
import { getUsersRouteHandler } from './get-users';
import { getUserRouteHandler } from './get-user';
import { updateUserRouteHandler } from './update-user';

const usersRoutes: Router = express.Router();

usersRoutes.get('/users', getUsersRouteHandler);
usersRoutes.post('/users', createUserRouteHandler);

usersRoutes.get('/users/:id', getUserRouteHandler);
usersRoutes.put('/users/:id', updateUserRouteHandler);
usersRoutes.delete('/users/:id', archiveUser);

export default usersRoutes;
