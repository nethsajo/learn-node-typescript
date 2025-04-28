import express, { type Router } from 'express';
import { registerAuthRouteHandler } from './register';

const authRoutes: Router = express.Router();

authRoutes.post('/auth/register', registerAuthRouteHandler);

export default authRoutes;
