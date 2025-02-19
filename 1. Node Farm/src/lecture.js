const fs = require("fs");
const http = require("http");

// 1. FILES
// Blocking, Synchronous way
// Each statement is basically processed one after another, line by line.
const input = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(input);

const output = `This is what we know about the avocado: ${input}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", output);
console.log("File written!");

// Non-blocking, Asynchronous way
// Node will start reading this file in the background
// As soon as it is ready, it will start the callback function
fs.readFile("./txt/start.txt", "utf-8", (error, fileName) => {
  if (error) return console.log("ERROR! 💥");
  fs.readFile(`./txt/${fileName}.txt`, "utf-8", (_, data) => {
    console.log(data);
    fs.readFile("./txt/append.txt", "utf-8", (_, append) => {
      fs.writeFile("./txt/final.txt", `${data} ${append}`, "utf-8", (error) => {
        console.log("Your file has been written! 😁");
      });
    });
  });
});

console.log("Will read file!");

// 2. SERVER

// Each time that a new request hits the server, the callback function will get called
// The callback function will have access to the:
// Request - all kinds of stuff (e.g request url)
// Response - tools, basically for dealing with response
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
