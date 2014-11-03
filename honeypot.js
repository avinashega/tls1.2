"use strict";

var tls = require('tls'),
  fs = require('fs'),
  mongoose = require('mongoose')
// MongoDB Connection
mongoose.connect('mongodb://localhost/dummy');

var packets = require('./packets').packets;

var options = {
  ca: [
    fs.readFileSync('./cert.pem')
  ],
  key: fs.readFileSync('./private-key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  requestCert: true,
  rejectUnauthorized: false
};


tls.createServer(options, function (s) {
  console.log(!s.authorized ? "TLS authorization error: " + s.authorizationError : "TLS Client authorized: " + s.authorized);
  console.log("Remote address: ", s.remoteAddress);
  console.log("Remote port: ", s.remotePort);
  var fragment = '';

  s.on('data', function(data) {
    var params = {};
    params.packet = data.toString();
    params.ip = s.remoteAddress;
    params.port = s.remotePort;
    packets.create(params, function(error, data){
      if (error) {
        console.log(error);
      }
    });
    s.write('random data from honeypot');
  });
}).listen(8766);