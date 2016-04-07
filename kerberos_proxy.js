var exec = require('child_process').exec;
var proxy_path = '"' + __dirname + '\\kerberosproxy.net\\KerberosProxy\\bin\\Debug\\KerberosProxy.exe"';

exports.start = function (options) {
  var cmd = [proxy_path, options.port, 'http://localhost:' + options.proxy_to, options.header, options.test_user].join(' ');
  return exec(cmd);
};
