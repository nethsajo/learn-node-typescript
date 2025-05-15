import { type NextFunction, type Request, type Response } from 'express';

export async function authenticationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const dbClient = request.dbClient;

  next();
}
