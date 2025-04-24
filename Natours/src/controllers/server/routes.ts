import express, { type Router } from 'express';
import { getServerDateTimeRouteHandler } from './get-server-date-time';

const serverRoutes: Router = express.Router();

serverRoutes.get('/server/date-time', getServerDateTimeRouteHandler);

export default serverRoutes;
