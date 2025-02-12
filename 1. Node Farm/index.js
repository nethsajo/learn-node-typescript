const http = require("http");
const url = require("url");

const server = http.createServer((request, response) => {
  console.log(request.url);

  const pathName = request.url;

  if (pathName === "/" || pathName === "/overview") {
    response.end("This is the OVERVIEW page!");
  } else if (pathName === "/product") {
    response.end("This is the PRODUCT page!");
  } else {
    // HTTP Header basically a piece of information about the response that we are sending back
    response.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });

    response.end("<h1>Page not found!</h1>");
  }
});

// Listen
server.listen(4001, "localhost", () => {
  console.log("Listening to request on port 4001");
});
