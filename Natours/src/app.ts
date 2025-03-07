import express, { Request, Response } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { APP_PORT } from './env';
import { Tour, tourSchemaObject } from './types/tour';

const app = express();

/***
 * Middleware
 * Basically a function that can modify the incoming request data
 * It's just a step that the request goes through while it's being processed
 *  */

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/mock/tours-simple.json`, 'utf-8')) as Tour[];

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

  try {
    const tour = tourSchemaObject.parse({ ...request.body, id: newId });

    tours.push(tour);

    fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(tours), error => {
      if (error) {
        response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          status: 'fail',
          message: 'Error writing file',
        });
      }

      response.status(StatusCodes.CREATED).json({
        status: 'success',
        data: { tour },
      });
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: error.errors, // Returns detailed validation errors
      });
    }

    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
});

app.listen(APP_PORT, () => {
  console.log('Listening on port', APP_PORT);
});
