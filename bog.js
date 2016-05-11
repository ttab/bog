/*global process, module*/
/*jshint -W086*/ // no `break` before `case` is OK

// default setup singleton
var conf = {
    debug: {on: false, out: console.log.bind(console)},
    info: {on: true, out: console.log.bind(console)},
    warn: {on: true, out: console.error.bind(console)},
    error: {on: true, out: console.error.bind(console)},
    includeTimeDesignator: false,
    includeTimeZone: false,
    format: function(level, args) {
        args.unshift(level.toUpperCase());
        args.unshift(localISOString());
        return args;
    }
};

var log = function (level, args) {
    var _ref;
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
    [conf.debug, conf.info, conf.warn, conf.error].forEach(function(item) {
        item.on = false;
    });
    switch (l) {
    case 'debug':
        conf.debug.on = true;
    case 'info':
        conf.info.on = true;
    case 'warn':
        conf.warn.on = true;
    case 'error':
        conf.error.on = true;
    }
};

var redirect = function (out, err) {
    conf.debug.out = out;
    conf.info.out = out;
    conf.warn.out = err;
    conf.error.out = err;
};

// ISO8601 in local time zone
var localISOString = function() {

    var d = new Date()
    , pad = function (n){return n<10 ? '0'+n : n;}
    , tz = typeof conf.fixedTimeZoneMinutes === 'number' ? conf.fixedTimeZoneMinutes :
            d.getTimezoneOffset() // mins
    , tzs = (tz>0?"-":"+") + pad(parseInt(Math.abs(tz/60)));

    tzs += tz%60 == 0 ? '00' : pad(Math.abs(tz%60));

    if (tz === 0) // Zulu time == UTC
        tzs = 'Z';

    return d.getFullYear()+'-'
        + pad(d.getMonth()+1)+'-'
        + pad(d.getDate())+(conf.includeTimeDesignator ? 'T' : ' ')+
        + pad(d.getHours())+':'
        + pad(d.getMinutes())+':'
        + pad(d.getSeconds()) + (conf.includeTimeZone ? tzs : '');
};

module.exports = {
    debug: debug,
    info: info,
    warn: warn,
    error: error,
    level: level,
    redirect: redirect,
    config: function() { return conf; }
};
