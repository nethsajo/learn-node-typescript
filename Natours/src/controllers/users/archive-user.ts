import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const archiveUser = (request: Request, response: Response) => {
  response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
