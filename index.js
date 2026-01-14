var Server = require('http').Server;
var util = require('util');
var freeport = require('freeport');
var kerberos_proxy = require('./kerberos_proxy');

function KerberosServer(handler, options) {
  const { maxHeaderSize } = options
  Server.call(this, { maxHeaderSize }, handler);
  this._options = options || {};
}

util.inherits(KerberosServer, Server);

KerberosServer.prototype.listen = function (handle, callback) {
  var self = this;

  freeport(function (err, node_port) {
    var opts = {
      proxy_to:  node_port,
      port:      handle,
      header:    self._options.header || 'X-Forwarded-User',
      test_user: self._options.test_user
    };

    KerberosServer.super_.prototype.listen.call(self, node_port, callback);

    var proxy = kerberos_proxy.start(opts);

    var proxyOutput = '';

    function storeProxyOutput (data) {
      proxyOutput += data.toString();
    }

    proxy.stdout.on('data', storeProxyOutput);
    proxy.stderr.on('data', storeProxyOutput);

    proxy.on('exit', function (signal) {
      if (signal) {
        var err = new Error('The .Net proxy exited with status ' + signal + '\n' +
                            'This is the full STDOOUT/STDERR of the process \n' + proxyOutput);
        self.emit('error', err);
      }
    });

    self._proxy = proxy;
  });

  return self;
};

module.exports = KerberosServer;