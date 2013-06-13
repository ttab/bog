/*global process, module*/

// singleton, hashed by pid
var config = {};

// default setup
config[process.pid] = {
    debug: {on: false, out: console.log},
    info: {on: true, out: console.log},
    warn: {on: true, out: console.error},
    error: {on: true, out: console.error},
    format: function(level, args) {
        args.unshift(level.toUpperCase());
        args.unshift((new Date()).toISOString());
        return args;
    }
};

var log = function (level, args) {
    var conf = config[process.pid], _ref;
    if (!(_ref = conf[level]).on || !_ref.out) return;
    args = conf.format(level, args);
    _ref.out.apply(null, args);
};

var slice = Array.prototype.slice;

var debug = function() {
    log('debug', slice.call(arguments));
};
var info = function() {
    log('info', slice.call(arguments));
};
var warn = function() {
    log('warn', slice.call(arguments));
};
var error = function() {
    log('error', slice.call(arguments));
};

var level = function (l) {
    var s = config[process.pid];
    [s.debug, s.info, s.warn, s.error].forEach(function(item) {
        item.on = false;
    });
    switch (l) {
        case 'debug':
        s.debug.on = true;
        case 'info':
        s.info.on = true;
        case 'warn':
        s.warn.on = true;
        case 'error':
        s.error.on = true;
    }
};

var redirect = function (out, err) {
    var s = config[process.pid];
    s.debug.out = out;
    s.info.out = out;
    s.warn.out = err;
    s.error.out = err;
};

module.exports = {
    debug: debug,
    info: info,
    warn: warn,
    error: error,
    level: level,
    redirect: redirect,
    config: function() { return config[process.pid] }
};
