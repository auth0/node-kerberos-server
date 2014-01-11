var exec = require('child_process').exec;
var debug = require('debug')('kerberos-server');
var proxy_path = '"' + __dirname + '\\kerberosproxy.net\\KerberosProxy\\bin\\Debug\\KerberosProxy.exe"';

exports.start = function (options) {
  var cmd = [proxy_path, options.port, 'http://localhost:' + options.proxy_to, options.header, options.test_user].join(' ');

  debug('running: ' + cmd);

  //start the proxy
  var proc = exec(cmd, function (err) {
    if (err) {
      console.log('can\'t start kerberosproxy.exe');
      process.exit(1);
    }
  }).on('exit', function (code) {
    if (code) {
      console.log('kerberosproxy.exe closed with status code ' + code);
      process.exit(1);
    }
  });

  proc.stdout.on('data', function (data) {
    debug('proxy: ' + data.toString());
  });

  proc.stderr.on('data', function (data) {
    debug('proxy: ' + data.toString());
  });
};