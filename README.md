Kerberos http server interface for node. __Windows Only.__

## Installation

~~~bash
$ npm i kerberos-server
~~~

__Note:__ you need .Net Framework 4.5 installed.

## Example

~~~javascript
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
~~~

## How it works?

The server has always a .Net proxy running listening to port, it authenticate requests and pipe to the real node http server running on a random free port (localhost only).

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
