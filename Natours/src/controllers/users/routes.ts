import express, { type Router } from 'express';
import { archiveUser, createUser, getUser, updateUser } from './controller';
import { getUsersRouteHandler } from './get-users';

const usersRoutes: Router = express.Router();

usersRoutes.route('/users').get(getUsersRouteHandler).post(createUser);
usersRoutes.route('/users/:id').get(getUser).put(updateUser).delete(archiveUser);

export default usersRoutes;
