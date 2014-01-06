var range_check = require('range_check');

var request = require('request').forever();

var debug = require('debug')('express-kerberos');

var kerberos_proxy = require('./kerberos_proxy');

require('http').globalAgent.maxSockets = 100;

var lan_ranges = [
  '10.0.0.0/8',
  '172.16.0.0/12',
  '192.168.0.0/16'
];

//This is a hack to separate "Negotiate, NTLM"
// in two www-authentication headers.
require('http').ServerResponse.prototype.setHeader = (function( old ) {
    return function( name, value ) {
      if ( name === 'www-authenticate' && value === 'Negotiate, NTLM' ) {
        var newval = value.split(',').map(function (t) {
          return t.trim();
        });
        return old.apply(this, [name, newval]);
      }
      return old.apply(this, arguments);
    };
  }( require('http').ServerResponse.prototype.setHeader ));

module.exports = function (options) {
  var backend, secret;

  kerberos_proxy.start(options, function (err, url, token) {
    backend = url;
    secret = token;
  });

  return function (req, res, next) {
    debug('entering kerberos middleware');

    if (options.check_ip) {
      debug('checking ip');
      if (req.ip !== '127.0.0.1' && !range_check.in_range(req.ip, lan_ranges)) {
        debug('request is not in the local ip range');
        return next();
      }
    }

    if (req.get(options.header + '-secret') === secret) {
      debug('authenticated request from .Net');
      return next();
    }

    res.removeHeader('x-powered-by');

    req.pipe(request(backend)).pipe(res);
  };
};