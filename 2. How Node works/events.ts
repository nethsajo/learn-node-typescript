import Event from 'events';
import http, { IncomingMessage, ServerResponse } from 'http';

class Sales extends Event {
  constructor() {
    super();
  }
}

const emitter = new Sales();

emitter.on('newSale', () => {
  console.log('There was a new sale!');
});

emitter.on('newSale', () => {
  console.log('Customer name: Jonas');
});

emitter.on('newSale', (stock: number) => {
  console.log(`There are now ${stock} items left in stock.`);
});

emitter.emit('newSale', 9);

const server = http.createServer();

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  console.log('Request received!');
  console.log(request.url);
  response.end('Request received');
});

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  console.log('Another request');
});

server.on('close', () => {
  console.log('Server closed');
});

server.listen(4001, 'localhost', () => {
  console.log('Waiting for requests...');
});
