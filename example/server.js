var express = require('express');
var app = express();
var kerberos_server = require('./..');

app.configure(function () {
  this.use(express.logger());
});

app.get('/', function (req, res) {
  res.send('hello ' + req.get('X-User'));
});

kerberos_server
  .createServer({
    port: 8919,
    header: 'X-User'
  }, app);