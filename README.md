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
~~~

## How it works?

The server has always a .Net proxy running it listening to port, it authenticate requests and pipe to the real node http server running on a random free port.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
