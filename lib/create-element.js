'use strict';

var onmlStringify = require('onml/lib/stringify.js');
var w3 = require('./w3.js');

function jsonmlParse (arr) {
    arr[1].xmlns = w3.svg;
    arr[1]['xmlns:xlink'] = w3.xlink;
    var s1 = onmlStringify(arr);
    var s2 = s1.replace(/&/g, '&amp;');
    var parser = new DOMParser();
    var doc = parser.parseFromString(s2, 'image/svg+xml');
    return doc.firstChild;
}

module.exports = jsonmlParse;
// module.exports = createElement;
