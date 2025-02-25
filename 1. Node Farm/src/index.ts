import { IncomingMessage, ServerResponse } from 'http';

import * as fs from 'fs';
import * as http from 'http';
import slugify from 'slugify';
import * as url from 'url';
import { replaceTemplate } from './modules/replace-template';
import { Product } from './types/product';

const _overview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const _card = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const _product = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const products = JSON.parse(data) as Product[];

const slugs = products.map(({ productName }) => slugify(productName, { lower: true }));

console.log(slugs);

const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
  const { query, pathname } = url.parse(request.url ?? '', true);

  if (pathname === '/' || pathname === '/overview') {
    response.writeHead(200, { 'Content-type': 'text/html' });

    const productList = products.map(product => replaceTemplate(_card, product)).join('');

    const output = _overview.replace(/{%PRODUCT_LIST%}/g, productList);

    response.end(output);
  } else if (pathname === '/product') {
    response.writeHead(200, { 'Content-type': 'text/html' });
    const product = products[Number(query.id)] as Product;
    const output = replaceTemplate(_product, product);
    response.end(output);
  } else if (pathname === '/api') {
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
