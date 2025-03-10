import express from 'express';
import { archiveUser } from './archive-user';
import { createUser } from './create-user';
import { getUser } from './get-user';
import { getUsers } from './get-users';
import { updateUser } from './update-user';

const usersRoutes = express.Router();

usersRoutes.route('/users').get(getUsers).post(createUser);
usersRoutes.route('/users/:id').get(getUser).put(updateUser).delete(archiveUser);

export default usersRoutes;
