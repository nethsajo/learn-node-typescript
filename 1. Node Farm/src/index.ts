import { IncomingMessage, ServerResponse } from 'http';

import * as fs from 'fs';
import * as http from 'http';

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const products = JSON.parse(data);

const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
  const pathName = request.url;

  if (pathName === '/' || pathName === '/overview') {
    response.end('This is the OVERVIEW page!');
  } else if (pathName === '/product') {
    response.end('This is the PRODUCT page!');
  } else if (pathName === '/api') {
    response.writeHead(200, { 'Content-type': 'application/json' });
    response.end(data);
  } else {
    // HTTP Header basically a piece of information about the response that we are sending back
    response.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });

    response.end('<h1>Page not found!</h1>');
  }
});

// Listen
server.listen(4001, 'localhost', () => {
  console.log('Listening to request on port 4001');
});
