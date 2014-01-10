var crypto = require('crypto');
var exec = require('child_process').exec;
var debug = require('debug')('express-kerberos');
var proxy_path = '"' + __dirname + '\\kerberosproxy.net\\KerberosProxy\\bin\\Debug\\KerberosProxy.exe"';

var freeport = require('freeport');

exports.start = function (options, callback) {
  freeport(function (err, port) {
    crypto.randomBytes(48, function(ex, buf) {
      var token = buf.toString('base64');

      var cmd = [proxy_path, port, options.proxy_to, options.header, token, options.test_user].join(' ');

      debug('running: ' + cmd);

      //start the proxy
      exec(cmd, function (err) {
        if (err) {
          console.log('can\'t start kerberosproxy.exe');
          process.exit(1);
        }
      }).on('exit', function (code) {
        if (code) {
          console.log('kerberosproxy.exe closed with status code ' + code);
          process.exit(1);
        }
      }).on('data', function (data) {
        debug('proxy: ' + data.toString());
      });

      callback(null, 'http://localhost:' + port, token);

    });

  });
};