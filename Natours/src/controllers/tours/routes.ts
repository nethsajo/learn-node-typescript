import express from 'express';
import { createTour, deleteTour, getTour, getTours, updateTour } from './controller';

const toursRoutes = express.Router();

toursRoutes.route('/tours').get(getTours).post(createTour);
toursRoutes.route('/tours/:id').get(getTour).put(updateTour).delete(deleteTour);

export default toursRoutes;
