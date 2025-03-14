import { type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getUsers = (request: Request, response: Response) => {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

export const getUser = (request: Request, response: Response) => {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

export const createUser = (request: Request, response: Response) => {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

export const updateUser = (request: Request, response: Response) => {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

export const archiveUser = (request: Request, response: Response) => {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
