import express, { type Router } from 'express';

import { createLocationRouteHandler } from './create-location';
import { authenticationMiddleware } from '@/middlewares/authentication';

const locationsRoutes: Router = express.Router();

locationsRoutes.use('/locations', authenticationMiddleware);

locationsRoutes.post('/locations', createLocationRouteHandler);

export default locationsRoutes;
