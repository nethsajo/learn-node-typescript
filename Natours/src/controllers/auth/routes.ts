import express, { type Router } from 'express';

import { authenticationMiddleware } from '@/middlewares/authentication';
import { changePasswordAuthRouteHandler } from './change-password';
import { loginAuthRouteHandler } from './login';
import { loginRequestLinkAuthRouteHandler } from './login-link-request';
import { logoutAuthRouteHandler } from './logout';
import { registerAuthRouteHandler } from './register';
import { requestPasswordResetRouteHandler } from './request-password-reset';
import { resetPasswordRouteHandler } from './reset-password';
import { verifyResetCodeRouteHandler } from './verify-reset-code';

const authRoutes: Router = express.Router();

authRoutes.post('/auth/register', registerAuthRouteHandler);
authRoutes.post('/auth/login', loginAuthRouteHandler);
authRoutes.put('/auth/change-password', authenticationMiddleware, changePasswordAuthRouteHandler);
authRoutes.delete('/auth/logout', authenticationMiddleware, logoutAuthRouteHandler);
authRoutes.post('/auth/reset-password/request', requestPasswordResetRouteHandler);
authRoutes.post('/auth/reset-password/verify', verifyResetCodeRouteHandler);
authRoutes.post('/auth/reset-password', resetPasswordRouteHandler);
authRoutes.post('/auth/login-link/request', loginRequestLinkAuthRouteHandler);

export default authRoutes;
