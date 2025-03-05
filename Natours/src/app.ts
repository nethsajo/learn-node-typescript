import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { APP_PORT } from './env';

const app = express();

app.get('/', (request: Request, response: Response) => {
  response.status(StatusCodes.OK).json({ app: 'Natours', message: 'Hello from Natours API!' });
});

app.post('/', (request: Request, response: Response) => {
  response.send('You can post to this endpoint...');
});

app.listen(APP_PORT, () => {
  console.log('Listening on port', APP_PORT);
});
