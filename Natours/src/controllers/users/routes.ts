import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

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

const usersRoutes = express.Router();

usersRoutes.route('/users').get(getUsers).post(createUser);
usersRoutes.route('/users/:id').get(getUser).put(updateUser).delete(deleteUser);

export default usersRoutes;
