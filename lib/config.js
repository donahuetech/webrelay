(function() {
  var RELAY_HOST, RELAY_MAC, ref;

  ref = process.env, RELAY_HOST = ref.RELAY_HOST, RELAY_MAC = ref.RELAY_MAC;

  RELAY_HOST = RELAY_HOST != null ? RELAY_HOST : '192.168.88.30';

  RELAY_MAC = RELAY_MAC != null ? RELAY_MAC : '00:0c:c8:03:13:22';

  module.exports = {
    RELAY_HOST: RELAY_HOST,
    RELAY_MAC: RELAY_MAC
  };

}).call(this);
