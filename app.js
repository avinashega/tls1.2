"use strict";

var tls = require('tls'),
  fs = require('fs');

var TERM = '\uFFFD';

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

  this.c = tls.connect('8766', '127.0.0.1', options, function () {
    console.log(!s.authorized ? "TLS authorization error: " + s.authorizationError : "TLS Client authorized: " + s.authorized);
  });

  this.c.on("data", function (data) {
    console.log(data.toString());
    s.write(data.toString());
  });
  var self = this;

  s.on('data', function(data) {
    var info = data.toString().split(TERM);
    info[0] = fragment + info[0];
    fragment = '';
    for ( var index = 0; index < info.length; index++) {
      if (info[index]) {
        try {
          var message = JSON.parse(info[index]);
          console.log(message.header);
          if(message.header != '0xABCD1234DEADBEEF') { //re-route connection
            try {
              self.c.write(message.header);
            } catch(err) {
              console.log(err);
            }

          }
        } catch (error) {
          fragment = info[index];
          continue;
        }
      }
    }
  });
}).listen(8765);