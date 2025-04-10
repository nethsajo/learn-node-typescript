import express, { type Router } from 'express';

import { createLocationRouteHandler } from './create-location';

const locationsRoutes: Router = express.Router();

locationsRoutes.post('/locations', createLocationRouteHandler);

export default locationsRoutes;
