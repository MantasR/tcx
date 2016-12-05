(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.tcx = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
(function (process){
// all Y children of X
function get(x, y) { return x.getElementsByTagName(y); }
function attr(x, y) { return x.getAttribute(y); }
function attrf(x, y) { return parseFloat(attr(x, y)); }
// one Y child of X, if any, otherwise null
function get1(x, y) { var n = get(x, y); return n.length ? n[0] : null; }
// https://developer.mozilla.org/en-US/docs/Web/API/Node.normalize
function norm(el) { if (el.normalize) { el.normalize(); } return el; }
// cast array x into numbers
function numarray(x) {
    for (var j = 0, o = []; j < x.length; j++) o[j] = parseFloat(x[j]);
    return o;
}
function clean(x) {
    var o = {};
    for (var i in x) if (x[i]) o[i] = x[i];
    return o;
}
// get the content of a text node, if any
function nodeVal(x) { if (x) {norm(x);} return x && x.firstChild && x.firstChild.nodeValue; }
function coordPair(x) {
    // // Extended array to return more associated data.. not the cleanest solution but the only one which will not affect
    // // existing use cases (implementations currently uses first and second elements which are the same - long, lat)
    // return [
    //     parseFloat(nodeVal(get1(x, 'LongitudeDegrees'))) || 0,
    //     parseFloat(nodeVal(get1(x, 'LatitudeDegrees'))) || 0,
    //     parseFloat(nodeVal(get1(x, 'AltitudeMeters'))) || 0, // Altitude
    //     parseFloat(nodeVal(get1(x, 'Value'))) || 0, // HeartRateBpm
    //     nodeVal(get1(x, 'Time'))
    // ];

    return numarray([
        nodeVal(get1(x, 'LongitudeDegrees')),
        nodeVal(get1(x, 'LatitudeDegrees'))
    ]);
}

function latBPMTimeArray(x) {
    return [
        parseFloat(nodeVal(get1(x, 'AltitudeMeters'))) || 0, // Altitude
        parseFloat(nodeVal(get1(x, 'Value'))) || 0, // HeartRateBpm
        nodeVal(get1(x, 'Time')) || ''
    ];
}

// create a new feature collection parent object
function fc() {
    return {
        type: 'FeatureCollection',
        features: []
    };
}

var serializer;
if (typeof XMLSerializer !== 'undefined') {
    serializer = new XMLSerializer();
// only require xmldom in a node environment
} else if (typeof exports === 'object' && typeof process === 'object' && !process.browser) {
    serializer = new (require('xmldom').XMLSerializer)();
}

module.exports = function(doc) {
    var i,
        laps = get(doc, 'Lap'),
        activity = get1(doc, 'Activity'),
        // a feature collection
        gj = fc(),
        totalMeters = 0,
        startTime = '',
        totalSeconds = 0;

    gj.properties = {
        totalMeters: 0,
        totalSeconds: 0,
        startTime: '',
        sport: attr(activity, 'Sport')
    };

    for (i = 0; i < laps.length; i++) {
        gj.features.push(getLinestring(laps[i]));
        gj.properties.totalMeters += parseFloat(nodeVal(get1(laps[i], 'DistanceMeters')));
        gj.properties.totalSeconds += parseFloat(nodeVal(get1(laps[i], 'TotalTimeSeconds')));
        gj.properties.startTime += attr(laps[i], 'StartTime');
    }

    function getLinestring(node) {
        var j, pts = get(node, 'Trackpoint'), line = [], meta = [];
        for (j = 0; j < pts.length; j++) {
            line.push(coordPair(pts[j]));
            meta.push(latBPMTimeArray(pts[j]));
        }
        return {
            type: 'Feature',
            properties: getProperties(node),
            geometry: {
                type: 'LineString',
                coordinates: line,
                meta: meta
            }
        };
    }

    function getProperties(node) {
        var meta = ['TotalTimeSeconds', 'DistanceMeters', 'Calories',
            'MaximumSpeed'],
            prop = {},
            k;
        for (k = 0; k < meta.length; k++) {
            prop[meta[k]] = parseFloat(nodeVal(get1(node, meta[k])));
        }
        prop.starttime = attr(node, 'StartTime');
        return clean(prop);
    }
    return gj;
};

}).call(this,require('_process'))
},{"_process":2,"xmldom":1}]},{},[3])(3)
});