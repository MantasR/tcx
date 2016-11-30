# VISIT ORIGINAL [PROJECT](https://github.com/mapbox/tcx)
This fork is modified for particular use case. Might provide unexpected data!

Sample result:

```js
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "TotalTimeSeconds": 2678,
                "DistanceMeters": 6164.9,
                "Calories": 530,
                "MaximumSpeed": 8.7,
                "starttime": "2009-08-30T13:41:31.000Z"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -77.02924,
                        38.925836,
                        55.8,
                        95,
                        "2009-08-30T13:41:31.000Z"
                    ],
                    [
                        -77.0293,
                        38.925828,
                        55.9,
                        95,
                        "2009-08-30T13:41:33.000Z"
                    ],
                    [
                        -77.029404,
                        38.925813,
                        55.8,
                        100,
                        "2009-08-30T13:41:35.000Z"
                    ]
                ]
            }
        }
    ],
    "properties": {
        "totalMeters": 6164.9,
        "totalSeconds": 2678,
        "startTime": "2009-08-30T13:41:31.000Z",
        "sport": "Running"
    }
}
```



# tcx

Convert [TCX](https://en.wikipedia.org/wiki/Training_Center_XML) files to
[GeoJSON](http://geojson.org/) in JavaScript.

## installation

    npm install tcx

Standalone:

https://raw.github.com/mapbox/tcx/master/tcx.js

## usage

```js
var parse = require('tcx');

// a tcx file dom, via xmldom
parse(tcxDom);
```

## api

### `parse(xmlDom)`

Given a DOM of TCX data either as a browser DOM object or via `xmldom` or
`jsdom`, parse and return a GeoJSON FeatureCollection object.

## binary

    npm install tcx -g

Usage with pipes:

    $ tcx < tcxfile.tcx > geojsonfile.geojson

Or with filenames

    $ tcx tcxfile.tcx anothertcxfile.tcx > output.geojson
