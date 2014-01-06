var express = require('express');
var http = require('http');

var app = express();
var kerberos = require('./..');

app.configure(function () {
  this.use(express.logger());

  this.use(kerberos({
    proxy_to: 'http://localhost:9090',
    check_ip: true,
    header:   'X-Forwarded-User'
  }));

});

app.get('/', function (req, res) {
  res.send('hello ' + req.get('X-Forwarded-User'));
});

http.createServer(app).listen(9090, function () {
  console.log('listening on http://localhost:9090');
});