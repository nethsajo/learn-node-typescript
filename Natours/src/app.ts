import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import { z } from 'zod';
import { envConfig } from './env';
import { Tour, tourSchemaObject } from './types/tour';

const app = express();
app.use(express.json());
app.use(morgan('tiny'));

/***
 * Middleware
 * Basically a function that can modify the incoming request data
 * It's just a step that the request goes through while it's being processed
 *  */

app.use((request: Request, response: Response, next: NextFunction) => {
  console.log('Hello from the middleware');
  // If the next didn't call here then the request/response cycle would stuck and never send back a response to the client
  next();
});

app.use((request: Request & { requestTime?: string }, response: Response, next: NextFunction) => {
  request.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/mock/tours-simple.json`, 'utf-8')) as Tour[];

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

// app.get('/api/v1/tours', getTours);
// app.get('/api/v1/tours/:id', getTour); // Add ? for optional parameter /:id/:x?
// app.post('/api/v1/tours', createTour);
// app.put('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).put(updateTour).delete(deleteTour);

const getUsers = (request: Request, response: Response) => {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const createUser = (request: Request, response: Response) => {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const getUser = (request: Request, response: Response) => {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const updateUser = (request: Request, response: Response) => {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const deleteUser = (request: Request, response: Response) => {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

app.route('/api/v1/users').get(getUsers).post(createUser);
app.route('/api/v1/users/:id').get(getUser).put(updateUser).delete(deleteUser);

app.listen(envConfig.APP_PORT, () => console.log('Listening on port', envConfig.APP_PORT));
