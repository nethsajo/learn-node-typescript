import express, { Request, Response } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { Tour, tourSchemaObject } from 'src/types/tour';
import { z } from 'zod';

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}../../../mock/tours-simple.json`, 'utf-8')
) as Tour[];

const getTours = (request: Request & { requestTime?: string }, response: Response) => {
  response.status(StatusCodes.OK).json({
    status: 'success',
    requested_at: request.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (request: Request, response: Response) => {
  const { id } = request.params;

  const tour = tours.find(tour => tour.id === Number(id));

  if (!tour) {
    return response.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'Invalid ID: Tour not found',
    });
  }

  response.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (request: Request, response: Response) => {
  const newId = tours[tours.length - 1]?.id ?? 0 + 1;

  try {
    const tour = tourSchemaObject.parse({ ...request.body, id: newId });

    tours.push(tour);

    fs.writeFile(`${__dirname}/data/tours-simple.json`, JSON.stringify(tours), error => {
      if (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
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
      return response.status(StatusCodes.BAD_REQUEST).json({
        status: 'fail',
        message: error.errors, // Returns detailed validation errors
      });
    }

    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
};

const updateTour = (request: Request, response: Response) => {
  const { id } = request.params;

  const tour = tours.find(tour => tour.id === Number(id));

  if (!tour) {
    return response.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'Invalid ID: Tour not found',
    });
  }

  response.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (request: Request, response: Response) => {
  const { id } = request.params;

  const tour = tours.find(tour => tour.id === Number(id));

  if (!tour) {
    return response.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'Invalid ID: Tour not found',
    });
  }

  response.status(StatusCodes.OK).json({
    status: 'success',
    data: null,
  });
};

const toursRoutes = express.Router();

toursRoutes.route('/tours').get(getTours).post(createTour);
toursRoutes.route('/tours/:id').get(getTour).put(updateTour).delete(deleteTour);

export default toursRoutes;
