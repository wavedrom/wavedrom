'use strict';

const stringify = require('onml/stringify.js');
const w3 = require('./w3.js');

function createElement (arr) {
    arr[1].xmlns = w3.svg;
    arr[1]['xmlns:xlink'] = w3.xlink;
    const s1 = stringify(arr);
    // const s2 = s1.replace(/&/g, '&amp;');
    const parser = new DOMParser();
    const doc = parser.parseFromString(s1, 'image/svg+xml');
    return doc.firstChild;
}

module.exports = createElement;
/* eslint-env browser */
