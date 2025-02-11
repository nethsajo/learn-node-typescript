const fs = require("fs");

// Blocking code execution
// Synchronous way which simply means that each statement is basically processed one after another, line by line.
const input = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(input);

const output = `This is what we know about the avocado: ${input}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", output);
console.log("File written!");

// Non-blocking code execution
// Asynchronous way worked in the background
