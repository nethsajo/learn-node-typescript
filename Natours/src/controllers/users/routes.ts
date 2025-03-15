import express, { type Router } from 'express';
import { archiveUser, createUser, getUser, getUsers, updateUser } from './controller';

const usersRoutes: Router = express.Router();

usersRoutes.route('/users').get(getUsers).post(createUser);
usersRoutes.route('/users/:id').get(getUser).put(updateUser).delete(archiveUser);

export default usersRoutes;
