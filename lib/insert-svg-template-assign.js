'use strict';

var jsonmlParse = require('./create-element'),
    w3 = require('./w3');

function insertSVGTemplateAssign (index, parent) {
    var node, e;
    // cleanup
    while (parent.childNodes.length) {
        parent.removeChild(parent.childNodes[0]);
    }
    e =
    ['svg', {id: 'svgcontent_' + index, xmlns: w3.svg, 'xmlns:xlink': w3.xlink, overflow:'hidden'},
        ['style', '.pinname {font-size:12px; font-style:normal; font-variant:normal; font-weight:500; font-stretch:normal; text-align:center; text-anchor:end; font-family:Helvetica} .wirename {font-size:12px; font-style:normal; font-variant:normal; font-weight:500; font-stretch:normal; text-align:center; text-anchor:start; font-family:Helvetica} .wirename:hover {fill:blue} .gate {color:#000; fill:#ffc; fill-opacity: 1;stroke:#000; stroke-width:1; stroke-opacity:1} .gate:hover {fill:red !important; } .wire {fill:none; stroke:#000; stroke-width:1; stroke-opacity:1} .grid {fill:#fff; fill-opacity:1; stroke:none}']
    ];
    node = jsonmlParse(e);
    parent.insertBefore(node, null);
}

module.exports = insertSVGTemplateAssign;

/* eslint-env browser */
