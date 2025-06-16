import { authenticationMiddleware } from '@/middlewares/authentication';
import express, { type Router } from 'express';
import { getMyProfileRouteHandler } from './get-my-profile';

const meRoutes: Router = express.Router();

meRoutes.use(authenticationMiddleware);

meRoutes.get('/me', getMyProfileRouteHandler);

export default meRoutes;
