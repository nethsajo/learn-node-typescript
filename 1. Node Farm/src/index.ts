import { IncomingMessage, ServerResponse } from 'http';

import * as fs from 'fs';
import * as http from 'http';
import { Product } from './types/product';

const replaceTemplate = (card: string, product: Product) => {
  let output = card.replace(/{%PRODUCT_ID%}/g, String(product.id));
  output = output.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);
  output = output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
  output = output.replace(/{%PRODUCT_FROM%}/g, product.from);
  output = output.replace(/{%PRODUCT_NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%PRODUCT_PRICE%}/g, String(product.price));
  output = output.replace(/{%PRODUCT_QUANTITY%}/g, String(product.quantity));
  if (!product.organic) output = output.replace(/{%PRODUCT_NOT_ORGANIC%}/g, 'not-organic');

  return output;
};

const overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const card = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const product = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const products = JSON.parse(data) as Product[];

const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
  const pathName = request.url;

  if (pathName === '/' || pathName === '/overview') {
    response.writeHead(200, { 'Content-type': 'text/html' });

    const productList = products.map(product => replaceTemplate(card, product)).join('');

    const output = overview.replace(/{%PRODUCT_LIST%}/g, productList);

    response.end(output);
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
