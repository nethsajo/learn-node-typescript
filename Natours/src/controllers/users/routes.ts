import express, { type Router } from 'express';
import { archiveUser, getUser, updateUser } from './controller';
import { createUserRouteHandler } from './create-user';
import { getUsersRouteHandler } from './get-users';

const usersRoutes: Router = express.Router();

usersRoutes.route('/users').get(getUsersRouteHandler).post(createUserRouteHandler);
usersRoutes.route('/users/:id').get(getUser).put(updateUser).delete(archiveUser);

export default usersRoutes;
