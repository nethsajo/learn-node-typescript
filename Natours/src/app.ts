import express, { Request, Response } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { APP_PORT } from './env';
import { Tour } from './types/tour';

const app = express();

/***
 * Middleware
 * Basically a function that can modify the incoming request data
 * It's just a step that the request goes through while it's being processed
 *  */

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours-simple.json`, 'utf-8')) as Tour[];

app.get('/api/v1/tours', (request: Request, response: Response) => {
  response.status(StatusCodes.OK).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (request: Request, response: Response) => {
  const newId = tours[tours.length - 1]?.id ?? 0 + 1;
  const newTour = Object.assign({ id: newId }, request.body);

  tours.push(newTour);

  fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(tours), error => {
    response.status(StatusCodes.CREATED).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
});

app.listen(APP_PORT, () => {
  console.log('Listening on port', APP_PORT);
});
