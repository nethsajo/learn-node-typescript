import express, { type Router } from 'express';

import { getMyProfileRouteHandler } from './get-my-profile';
import { authenticationMiddleware } from '@/middlewares/authentication';

const meRoutes: Router = express.Router();

meRoutes.use('/me', authenticationMiddleware);

meRoutes.get('/me', getMyProfileRouteHandler);

export default meRoutes;
