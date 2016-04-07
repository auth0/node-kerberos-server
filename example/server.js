var express = require('express');
var app = express();
var KerberosServer = require('./..');

app.configure(function () {
  this.use(express.logger());
});

app.get('/', function (req, res) {
  res.send('hello ' + req.get('X-User'));
});

var server = new KerberosServer(app);

server.listen(8080, function () {
  console.log('app listening on http://localhost:8080');
}).on('error', function (err) {
  console.error(err.message);
  process.exit(1);
});