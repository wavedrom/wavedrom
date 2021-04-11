'use strict';

var onmlStringify = require('onml/stringify.js');
var w3 = require('./w3.js');

function createElement (arr) {
    arr[1].xmlns = w3.svg;
    arr[1]['xmlns:xlink'] = w3.xlink;
    var s1 = onmlStringify(arr);
    // var s2 = s1.replace(/&/g, '&amp;');
    var parser = new DOMParser();
    var doc = parser.parseFromString(s1, 'image/svg+xml');
    return doc.firstChild;
}

module.exports = createElement;
/* eslint-env browser */
