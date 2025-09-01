import express, { type Router } from 'express';

import { loginAuthRouteHandler } from './login';
import { registerAuthRouteHandler } from './register';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { changePasswordAuthRouteHandler } from './change-password';
import { logoutAuthRouteHandler } from './logout';
import { verifySessionAuthRouteHandler } from './verify-session';
import { requestPasswordResetRouteHandler } from './request-password-reset';

const authRoutes: Router = express.Router();

authRoutes.post('/auth/register', registerAuthRouteHandler);
authRoutes.post('/auth/login', loginAuthRouteHandler);
authRoutes.get('/auth/verify-session', authenticationMiddleware, verifySessionAuthRouteHandler);
authRoutes.put('/auth/change-password', authenticationMiddleware, changePasswordAuthRouteHandler);
authRoutes.delete('/auth/logout', authenticationMiddleware, logoutAuthRouteHandler);
authRoutes.post('/auth/reset-password/request', requestPasswordResetRouteHandler);

export default authRoutes;
