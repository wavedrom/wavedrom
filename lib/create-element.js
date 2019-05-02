'use strict';


// function createElement (obj) {
//     var el;
//
//     el = document.createElement('g');
//     el.innerHTML = obj2ml(obj);
//     return el.firstChild;
// }

// var jsonmlParse = require('./jsonml-parse');

var onmlStringify = require('onml/lib/stringify.js');
var w3 = require('./w3.js');

function jsonmlParse (arr) {
    var el = document.createElementNS(w3.svg, 'g');
    el.innerHTML = onmlStringify(arr);
    return el.childNodes[0];
}

module.exports = jsonmlParse;
// module.exports = createElement;
