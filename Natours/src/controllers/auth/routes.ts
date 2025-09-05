import express, { type Router } from 'express';

import { loginAuthRouteHandler } from './login';
import { registerAuthRouteHandler } from './register';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { changePasswordAuthRouteHandler } from './change-password';
import { logoutAuthRouteHandler } from './logout';
import { requestPasswordResetRouteHandler } from './request-password-reset';
import { verifyResetCodeRouteHandler } from './verify-reset-code';
import { resetPasswordRouteHandler } from './reset-password';

const authRoutes: Router = express.Router();

authRoutes.post('/auth/register', registerAuthRouteHandler);
authRoutes.post('/auth/login', loginAuthRouteHandler);
authRoutes.put('/auth/change-password', authenticationMiddleware, changePasswordAuthRouteHandler);
authRoutes.delete('/auth/logout', authenticationMiddleware, logoutAuthRouteHandler);
authRoutes.post('/auth/reset-password/request', requestPasswordResetRouteHandler);
authRoutes.post('/auth/reset-password/verify', verifyResetCodeRouteHandler);
authRoutes.post('/auth/reset-password', resetPasswordRouteHandler);

export default authRoutes;
