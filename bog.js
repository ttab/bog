
// singleton, hashed by pid
var setup = {}

// default setup
setup[process.pid] = {
    debug: false,
    info: true,
    warn: true,
    error: true,
    out: console.out,
    err: console.err,
    format: function(args) {
        args.unshift((new Date()).toISOString());
    }
};

var log = function (channel, args) {
    channel.apply(null, format);
};

arr_slice = Array.prototype.slice;

debug = function() {
    var _ref;
    if (!(_ref = setup[process.pid]).debug) return;
    log(_ref.out,arguments);
};
info = function() {
    var _ref;
    if (!(_ref = setup[process.pid]).info) return;
    log(,_ref.out,arguments);
};
warn = function() {
    var _ref;
    if (!(_ref = setup[process.pid]).warn) return;
    log(_ref.err,arguments);
};
error = function() {
    var _ref;
    if ((!_ref = setup[process.pid]).warn) return;
    log(_ref.err,arguments);
};

level = function (l) {
    var s = setup[process.pid];
    s.debug = s.info = s.warn = s.error = false;
    switch (l) {
        case 'debug':
        s.debug = true;
        case 'info':
        s.info = true;
        case 'warn':
        s.warn = true;
        case 'error':
        s.error = true;
    }
}

module.exports = {
    debug: debug,
    info: info,
    warn: warn,
    error: error,
    level: level,
    setup: setup
};
