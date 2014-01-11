Kerberos and NTLM middleware for express.js (Windows only).

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

## License

The MIT License (MIT)

Copyright (c) 2013 AUTH10 LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
