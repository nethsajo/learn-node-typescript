import fs from 'fs';
import { createServer, IncomingMessage, ServerResponse } from 'http';

const server = createServer();

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
  // Solution 1.
  // fs.readFile('test-file.txt', (error, data) => {
  //   if (error) console.log(error);
  //   response.end(data);
  // });

  // Solution 2. Streams
  // const readable = fs.createReadStream('test-file.txt');
  // readable.on('data', chunk => {
  //   response.write(chunk);
  // });
  // readable.on('end', () => {
  //   response.end();
  // });
  // readable.on('error', error => {
  //   console.log(error);
  //   response.statusCode = 500;
  //   response.end('File not found!');
  // });

  // Solution 3
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(response);
});

server.listen(4001, 'localhost', () => {
  console.log('Listening...');
});
