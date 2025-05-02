import express, { type Router } from 'express';

import { loginAuthRouteHandler } from './login';
import { registerAuthRouteHandler } from './register';

const authRoutes: Router = express.Router();

authRoutes.post('/auth/register', registerAuthRouteHandler);
authRoutes.post('/auth/login', loginAuthRouteHandler);

export default authRoutes;
