//
// tls-client.js
//
// Example of a Transport Layer Security (or TSL) client
//
// References:
//    http://nodejs.org/api/tls.html
//    http://docs.nodejitsu.com/articles/cryptography/how-to-use-the-tls-module
//

// Always use JavaScript strict mode. 
"use strict";

// Modules required here
var TLSClient = require('./client.js');

var c1 = new TLSClient('127.0.0.1', 8765);

var message = {
  "header" : "0xABCD1234DEADBEEF"
}

var message1 = {
  "header" : "0xABCD1234DEADBEEE"
}

var seqNo = 0;

c1.on('connect', function (err) {
  console.log('Client connected.');
  seqNo = 0;
  setInterval(function () {
    c1.write (message);
  }, 1000);
  setInterval(function () {
    c1.write (message1);
  }, 10000);
});

c1.on('disconnect', function (err) {
  console.log('Client disconnected');
});

console.log('STARTED');