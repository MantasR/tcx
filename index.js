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
