"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
setTimeout(function () { return console.log("Timer 1 finished"); }, 0);
setImmediate(function () { return console.log("Immediate 1 finished"); });
fs.readFile("test-file.txt", function () {
    console.log("I/O finished");
});
console.log("Hello from the top-level code");
