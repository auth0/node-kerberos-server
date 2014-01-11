var http = require('http');
var kerberos_proxy = require('./kerberos_proxy');
var freeport = require('freeport');

exports.createServer = function (options, callback) {
  if (!isNaN(options)) {
    options = {
      port: options
    };
  }

  freeport(function (err, node_port) {

    var opts = {
      proxy_to: node_port,
      port: options.port,
      header: options.header || 'X-Forwarded-User',
      test_user: options.test_user
    };

    kerberos_proxy.start(opts);

    //this could be https
    http.createServer(callback)
        .listen(node_port);
  });
};