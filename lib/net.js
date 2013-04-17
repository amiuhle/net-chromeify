'use strict';

// Returns an array [options] or [options, cb]
// It is the same as the argument of Socket.prototype.connect().
function normalizeConnectArgs(args) {
  var options = {};

  if (typeof args[0] === 'object') {
    // connect(options, [cb])
    options = args[0];
  } else {
    // connect(port, [host], [cb])
    options.port = args[0];
    if (typeof args[1] === 'string') {
      options.host = args[1];
    }
  }

  var cb = args[args.length - 1];
  return (typeof cb === 'function') ? [options, cb] : [options];
}

function Socket(options) {
  console.log('Socket', options);
  var self = this;
  this._options = options;
  chrome.socket.create('tcp', null, function(createInfo) {
    console.log('socket created', createInfo);
    self._socketId = createInfo.socketId;
  });
}

Socket.prototype.read = function(n) {
  console.log('read', n);
};


Socket.prototype.listen = function() {
  console.log('listen');
};


Socket.prototype.setTimeout = function(msecs, callback) {
  console.log('setTimeout', msecs, callback);
};


Socket.prototype.setNoDelay = function(enable) {
  console.log('setNoDelay', enable);
};


Socket.prototype.setKeepAlive = function(setting, msecs) {
  console.log('setKeepAlive', setting, msecs);
};


Socket.prototype.address = function() {
  console.log('address');
};


Object.defineProperty(Socket.prototype, 'readyState', {
  get: function() {
    if (this._connecting) {
      return 'opening';
    } else if (this.readable && this.writable) {
      return 'open';
    } else if (this.readable && !this.writable) {
      return 'readOnly';
    } else if (!this.readable && this.writable) {
      return 'writeOnly';
    } else {
      return 'closed';
    }
  }
});


Object.defineProperty(Socket.prototype, 'bufferSize', {
  get: function() {
    if (this._handle) {
      return this._handle.writeQueueSize + this._writableState.length;
    }
  }
});

Socket.prototype.end = function(data, encoding) {
  console.log('end', data, encoding);
};

Socket.prototype.destroy = function(exception) {
  console.log('destroy', exception);
};

Socket.prototype.write = function(chunk, encoding, cb) {
  console.log('write', chunk, encoding, cb);
};

Socket.prototype.connect = function(options, cb) {
  if (typeof options !== 'object') {
    // Old API:
    // connect(port, [host], [cb])
    // connect(path, [cb]);
    var args = normalizeConnectArgs(arguments);
    return Socket.prototype.connect.apply(this, args);
  }

  console.log('connect', options, cb);
  console.log(this._socketId);

  chrome.socket.connect(this._socketId, options.host, options.port, function (result) {
    console.log('connected', result);
  });
};


Socket.prototype.ref = function() {
  console.log('ref');
};


Socket.prototype.unref = function() {
  console.log('unref');
};


function Server(/* [ options, ] listener */) {
  if (!(this instanceof Server)) {
    return new Server(arguments[0], arguments[1]);
  }

  var self = this;

  var options;

  if (typeof arguments[0] === 'function') {
    options = {};
    self.on('connection', arguments[0]);
  } else {
    options = arguments[0] || {};

    if (typeof arguments[1] === 'function') {
      self.on('connection', arguments[1]);
    }
  }

  this._connections = 0;

  Object.defineProperty(this, 'connections', {
    get: function() {

      if (self._usingSlaves) {
        return null;
      }
      return self._connections;
    },
    set: function(val) {
      self._connections = val;
    },
    configurable: true,
    enumerable: true
  });

}

Server.prototype.listen = function() {
  console.log('listen');
};

Server.prototype.address = function() {
  console.log('address');
};

Server.prototype.getConnections = function(cb) {
  console.log('getConnections', cb);
};

Server.prototype.close = function(cb) {
  console.log('close', cb);
};

Server.prototype.ref = function() {
};

Server.prototype.unref = function() {

};

exports.createServer = function() {
  return new Server(arguments[0], arguments[1]);
};

exports.connect = exports.createConnection = function() {
  var args = arguments;
  var s = new Socket(args[0]);
  return Socket.prototype.connect.apply(s, args);
};

exports.Server = Server;
exports.Socket = Socket;

// TODO: isIP should be moved to the DNS code. Putting it here now because
// this is what the legacy system did.
exports.isIP = function() {
  return 4;
};


exports.isIPv4 = function(input) {
  return exports.isIP(input) === 4;
};


exports.isIPv6 = function(input) {
  return exports.isIP(input) === 6;
};