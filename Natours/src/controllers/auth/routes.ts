import express, { type Router } from 'express';

import { loginAuthRouteHandler } from './login';
import { registerAuthRouteHandler } from './register';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { changePasswordAuthRouteHandler } from './change-password';

const authRoutes: Router = express.Router();

authRoutes.post('/auth/register', registerAuthRouteHandler);
authRoutes.post('/auth/login', loginAuthRouteHandler);
authRoutes.put('/auth/change-password', authenticationMiddleware, changePasswordAuthRouteHandler);

export default authRoutes;
