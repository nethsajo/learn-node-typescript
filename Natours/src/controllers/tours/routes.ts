import express, { type Router } from 'express';
import { checkId, createTour, deleteTour, getTour, getTours, updateTour } from './controller';

const toursRoutes: Router = express.Router();

// toursRoutes.param('id', (request: Request, response: Response, next: NextFunction, id: string) => {
//   console.log(`Tour id is: ${id}`);
//   next();
// });

toursRoutes.param('id', checkId);

toursRoutes.route('/tours').get(getTours).post(createTour);
toursRoutes.route('/tours/:id').get(getTour).put(updateTour).delete(deleteTour);

export default toursRoutes;
