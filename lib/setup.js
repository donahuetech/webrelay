(function() {
  var spawn;

  spawn = require('child_process').spawn;

  exports.arp = function(ip, mac, callback) {
    var arp, stderr, stdout;
    stdout = stderr = '';
    arp = spawn('arp', ['-s', ip, mac]);
    arp.stdout.on('data', function(data) {
      return stdout += data.toString();
    });
    arp.stderr.on('data', function(data) {
      return stderr += data.toString();
    });
    return arp.on('close', function(code) {
      if (code !== 0) {
        return process.nextTick(function() {
          return callback(code, {
            code: code,
            out: stdout,
            err: stderr
          });
        });
      } else {
        return process.nextTick(function() {
          return callback(null, {
            code: code,
            out: stdout,
            err: stderr
          });
        });
      }
    });
  };

  exports.ping = function(ip, callback) {
    var ping, stderr, stdout;
    stdout = stderr = '';
    ping = spawn('ping', ['-c', '2', '-s', '102', ip]);
    ping.stdout.on('data', function(data) {
      return stdout += data.toString();
    });
    ping.stderr.on('data', function(data) {
      return stderr += data.toString();
    });
    return ping.on('close', function(code) {
      if (code === 0) {
        return process.nextTick(function() {
          return callback(null, {
            code: code,
            out: stdout,
            err: stderr,
            transmitted: true,
            responded: true
          });
        });
      } else if (code === 2 || code === 68) {
        return process.nextTick(function() {
          return callback(null, {
            code: code,
            out: stdout,
            err: stderr,
            transmitted: true,
            responded: false
          });
        });
      } else {
        return process.nextTick(function() {
          return callback(code, {
            code: code,
            out: stdout,
            err: stderr,
            transmitted: false,
            responded: false
          });
        });
      }
    });
  };

  exports.run = function(relayIP, relayMAC, callback) {
    var errors;
    errors = {
      arp: null,
      ping: null
    };
    return this.arp(relayIP, relayMAC, (function(_this) {
      return function(arpErr, arpRes) {
        if (arpErr) {
          errors.arp = arpRes;
          return callback(errors, null);
        }
        return _this.ping(relayIP, function(pingErr, pingRes) {
          if (pingErr) {
            errors.ping = pingRes;
            return callback(errors, null);
          } else if (pingRes.responded) {
            return callback(null, true);
          } else {
            errors.ping = pingRes;
            return callback(errors, null);
          }
        });
      };
    })(this));
  };

}).call(this);
